import { useEffect } from 'react';
import { useState } from 'react';
import { config } from '../../utils/config';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import ChannelModal, { SubscriptionFormData } from '../Modal/channelModal';

type Channel = {
    id: string;
    channel_name: string;
    channel_url: string;
    channel_type: string;
    channel_status: string;
    channel_description: string;
    channel_image_url: string;
    channel_created_at: string;
    channel_updated_at: string;
}

export default function Channels(){
    const { user } = useAuth();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const router = useRouter();

    // Handle token retrieval on client side only
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        if (!storedToken) {
            router.push('/login');
        } else {
            setToken(storedToken);
        }
    }, [router]);

    // Fetch channels when token is available
    useEffect(() => {
        if (!token) return;
        
        const fetchChannels = async () => {
            try {
                const response = await fetch(`${config.api_url}/v1/subscription-channels`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    setError(response.statusText);
                    return;
                }
                
                const data = await response.json() as Channel[];
                setChannels(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchChannels();
    }, [token]); 
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg">Loading channels...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Channels</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    const openModal = (channel: Channel) => {
        setSelectedChannel(channel);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedChannel(null);
    };

    // Helper function to handle rollback of subscription detail
    const rollbackSubscriptionDetail = async (subscriptionDetailId: string): Promise<boolean> => {
        try {
            console.log('Rolling back: Deleting subscription detail...');
            const rollbackResponse = await fetch(`${config.api_url}/v1/subscription-details/${subscriptionDetailId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (rollbackResponse.ok) {
                return true;
            } else {
                return false;
            }
        } catch (rollbackError) {
            console.error('Error during rollback:', rollbackError);
            return false;
        }
    };

    const handleSubscriptionSubmit = async (subscriptionData: SubscriptionFormData) => {        
        // Clear any previous errors and set loading state
        setSubscriptionError(null);
        setIsSubscribing(true);
        
        let subscriptionDetailId: string | null = null;
        
        try {
            // Step 1: Create subscription detail
            const detailResponse = await fetch(`${config.api_url}/v1/subscription-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    subscription_channel_id: selectedChannel?.id,
                    ...subscriptionData
                })
            });
            
            if (!detailResponse.ok) {
                const errorText = await detailResponse.text();
                setSubscriptionError(`Failed to create subscription: ${detailResponse.status === 409 ? 'You already have a subscription to this channel' : `Error creating subscription: ${errorText}`}`);
                return; 
            }
            
            const detailData = await detailResponse.json();
            subscriptionDetailId = detailData.id;
            
            // Step 2: Create subscription event
            const eventResponse = await fetch(`${config.api_url}/v1/subscription-events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    subscription_details_id: subscriptionDetailId,
                    account_id: user?.id,
                })
            });
            
            if (!eventResponse.ok) {
                const errorText = await eventResponse.text();
                setSubscriptionError(`Failed to create subscription event: ${eventResponse.status === 409 ? 'Event creation failed' : `Error creating subscription event: ${errorText}`}`);
                
                // Rollback: Delete the subscription detail since event failed
                if (subscriptionDetailId) {
                    const rollbackSuccess = await rollbackSubscriptionDetail(subscriptionDetailId);
                    if (rollbackSuccess) {
                        setSubscriptionError(prev => prev + " Rollback succeeded: subscription detail deleted.");
                    } else {
                        setSubscriptionError(prev => prev + " Rollback failed: could not delete subscription detail.");
                    }
                }
                return; // Exit early after setting error message
            }
            
            const eventData = await eventResponse.json();
            
            // Both operations succeeded
            closeModal();
            
        } catch (error: any) {            
            // Rollback: If subscription detail was created but event failed, delete the detail
            if (subscriptionDetailId) {
                const rollbackSuccess = await rollbackSubscriptionDetail(subscriptionDetailId);
                if (rollbackSuccess) {
                    setSubscriptionError(prev => prev + " Rollback succeeded: subscription detail deleted.");
                } else {
                    setSubscriptionError(prev => prev + " Rollback failed: exception occurred during deletion.");
                }
            }
            
            // Set error state for frontend display
            setSubscriptionError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <div className="min-h-screen py-8">
            <div className="mx-auto px-4">
                {channels.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📺</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Channels Found</h3>
                        <p className="text-gray-500">You haven't added any channels yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                        {channels.map((channel) => (
                            <div key={channel.id} className="bg-white transition-all duration-300 overflow-hidden group w-full">
                                {/* Channel Image */}
                                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                                    {channel.channel_image_url ? (
                                        <img 
                                            src={channel.channel_image_url} 
                                            alt={channel.channel_name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-white text-4xl font-bold">
                                                {channel.channel_name.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            channel.channel_status === 'active' 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-gray-500 text-white'
                                        }`}>
                                            {channel.channel_status}
                                        </span>
                                    </div>
                                </div>

                                {/* Channel Info */}
                                <div className="py-6 px-2">
                                    <div className="flex flex-row items-start justify-between mb-3">
                                        <p className="group-hover:text-blue-600 transition-colors truncate">
                                            {channel.channel_name}
                                        </p>
                                        {/* Channel URL */}
                                        {channel.channel_url && (
                                            <div className="mb-4">
                                                <a 
                                                    href={channel.channel_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 group/link"
                                                >
                                                    <span>Visit Channel</span>
                                                    <svg className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {channel.channel_description && (
                                        <p className="text-gray-600 text-sm mb-4 overflow-hidden" style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical'
                                        }}>
                                            {channel.channel_description}
                                        </p>
                                    )}

                                    <button 
                                        onClick={() => openModal(channel)}
                                        className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center gap-1 group/link py-2 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                                    >
                                        <span>Subscribe</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <ChannelModal
                isOpen={isModalOpen}
                onClose={closeModal}
                channel={selectedChannel}
                submitHandlerFromParent={handleSubscriptionSubmit}
            />

            {/* Subscription Error Display */}
            {subscriptionError && (
                <div className="fixed bottom-6 right-6 max-w-md bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-2">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-red-800">Subscription Failed</h3>
                            <p className="text-sm text-red-700 mt-1">{subscriptionError}</p>
                        </div>
                        <button
                            onClick={() => setSubscriptionError(null)}
                            className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}