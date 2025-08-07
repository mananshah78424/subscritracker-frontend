import { useEffect } from 'react';
import { useState } from 'react';
import { config } from '../../utils/config';
import { useRouter } from 'next/router';

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
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
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
                    throw new Error(`HTTP error! status: ${response.status}`);
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

                                    
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}