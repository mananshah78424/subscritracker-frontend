import { useEffect, useState } from "react";
import ProtectedRoute from "../ProtectedRoute";
import { config } from "../../utils/config";
import { useAuth } from "../../contexts/AuthContext";

enum SortOption {
  PriceHighLow = "price-high-low",
  PriceLowHigh = "price-low-high"
}

interface Subscription {
  id: number;
  account_id: number;
  subscription_channel_id: number;
  subscription_channel_name: string;
  channel_image_url: string;
  start_date: Date;
  next_due_date: Date;
  due_type: 'monthly' | 'weekly' | 'daily' | 'yearly';
  status: string;
  monthly_bill: number;
  reminder_date: Date | null;
  reminder_time: Date | null;
}

export default function Subscriptions() {
  const { token } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption | "">("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const userSubscriptions = `${config.api_url}/v1/user-subscription-details`;
        const response = await fetch(userSubscriptions, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSubscriptions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
        console.error('Error fetching subscriptions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSubscriptions();
    }
  }, [token]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    // If the amount is a whole number, don't show decimals
    if (Number.isInteger(amount)) {
      return `$${amount.toLocaleString()}`;
    }
    // For decimal amounts, show up to 2 decimal places
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const sortSubscriptions = (subscriptions: Subscription[], sortOption: SortOption | "") => {
    if (sortOption === SortOption.PriceHighLow) {
        return [...subscriptions].sort((a,b)=>b.monthly_bill - a.monthly_bill)
    } else if (sortOption === SortOption.PriceLowHigh) {
        return [...subscriptions].sort((a,b)=>a.monthly_bill - b.monthly_bill)
    }
    return subscriptions;
  };

  const sortedSubscriptions = sortSubscriptions(subscriptions, sortBy);

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your subscriptions...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Subscriptions</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Subscriptions</h1>
            <p className="text-gray-600">
                {subscriptions && subscriptions.length > 0 ?
                `Manage and track your ${subscriptions.length} subscription${subscriptions.length !== 1 ? 's' : ''}`
                :
                "Start adding subscriptions to manage and track your bills"
                }   
            </p>
          </div>

          {/* Filter Section */}
          {subscriptions && subscriptions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
              <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 mr-3">
                  Sort by:
                </label>
                <select 
                    id='sort-select'
                    value={sortBy}
                    onChange={(e)=>setSortBy(e.target.value as SortOption | "")}
                    className="ml-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                <option value="">Default</option>
                  <option value={SortOption.PriceHighLow}>Price: High to Low</option>
                  <option value={SortOption.PriceLowHigh}>Price: Low to High</option>
                </select>
                
              </div>
            </div>
          </div>
          )}

          {/* Subscriptions Grid */}
          {subscriptions && subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subscriptions Found</h3>
                <p className="text-gray-500">You don't have any subscriptions yet.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subscriptions && sortedSubscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  {/* Card Header with Image and Status */}
                  <div className="relative p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-shrink-0">
                        {subscription.channel_image_url ? (
                          <img
                            src={subscription.channel_image_url}
                            alt={subscription.subscription_channel_name}
                            className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${subscription.channel_image_url ? 'hidden' : ''}`}>
                          <span className="text-white font-bold text-lg">
                            {subscription.subscription_channel_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(subscription.status)}`}>
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </span>
                    </div>

                    {/* Service Name */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {subscription.subscription_channel_name}
                    </h3>

                    {/* Monthly Bill */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatCurrency(subscription.monthly_bill)}
                      </span>
                      <span className="text-sm text-gray-500">/month</span>
                    </div>
                  </div>

                  {/* Card Body with Details */}
                  <div className="px-6 pb-6 space-y-4">
                    {/* Due Date Section */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Next Payment</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(subscription.next_due_date)}
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className={`text-xs font-medium ${
                          getDaysUntilDue(subscription.next_due_date).includes('overdue') 
                            ? 'text-red-600' 
                            : getDaysUntilDue(subscription.next_due_date).includes('today') || getDaysUntilDue(subscription.next_due_date).includes('tomorrow')
                            ? 'text-orange-600'
                            : 'text-green-600'
                        }`}>
                          {getDaysUntilDue(subscription.next_due_date)}
                        </span>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Started</span>
                        <span className="text-gray-900">{formatDate(subscription.start_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reminder</span>
                        <span className="text-gray-900">{subscription.reminder_date ? formatDate(subscription.reminder_date) : 'None'}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                      Manage Subscription
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary Footer */}
          {subscriptions && subscriptions.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {subscriptions.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Subscriptions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(subscriptions.reduce((sum, sub) => sum + sub.monthly_bill, 0))}
                  </div>
                  <div className="text-sm text-gray-600">Monthly Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(subscriptions.reduce((sum, sub) => sum + sub.monthly_bill, 0) * 12)}
                  </div>
                  <div className="text-sm text-gray-600">Annual Total</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}