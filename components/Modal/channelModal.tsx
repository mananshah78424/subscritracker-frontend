import React, { useState, FormEvent } from 'react';
import { Calendar, Clock, DollarSign, X, Bell } from 'lucide-react';
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

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel | null;
  submitHandlerFromParent?: (data: SubscriptionFormData) => void;
}

export interface SubscriptionFormData {
  start_date: string;
  start_time: string;
  due_date: string;
  due_time: string;
  monthly_bill: number;
  reminder_date: string;
  reminder_time: string;
}

export default function ChannelModal({ isOpen, onClose, channel, submitHandlerFromParent }: ChannelModalProps) {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    start_date: '',
    start_time: '',
    due_date: '',
    due_time: '',
    monthly_bill: 0,
    reminder_date: '',
    reminder_time: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if(submitHandlerFromParent) {
        submitHandlerFromParent({ ...formData });
      }else{
        console.log('No submit handler from parent');
        console.log('Form data: ', formData);
        console.log("Need to implement here since no submit handler from parent");
      }
      
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to save subscription');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !channel) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col space-y-1.5 p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold tracking-tight text-xl">Subscribe to Channel</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-zinc-600">Set up your subscription details for {channel.channel_name}</p>
        </div>

        {/* Channel Info */}
        <div className="flex items-center gap-3 p-6 border-b">
          <img
            src={channel.channel_image_url}
            alt={channel.channel_name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold">{channel.channel_name}</h4>
            <p className="text-xs text-zinc-500">
              {channel.channel_description}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="flex flex-row gap-4">
            {/* Start Date */}
            <div className="w-1/2">
              <label className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="start_date">
                <Calendar className="w-4 h-4 text-gray-500" />
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-[10px]"
                id="start_date"
                required
              />
            </div>

            {/* Start Time */}
            <div className="w-1/2">
              <label className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="start_time">
                <Clock className="w-4 h-4 text-gray-500" />
                Start Time
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-[10px]"
              />
            </div>
            </div>

            <div className="flex flex-row gap-4">
            {/* Due Date */}
            <div className="w-1/2">
              <label className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="due_date">
                <Calendar className="w-4 h-4 text-gray-500" />
                Due Date
              </label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-[10px]"
                  id="due_date"
                required
              />
            </div>

            {/* Due Time */}
            <div className="w-1/2">
              <label className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="due_time">
                <Clock className="w-4 h-4 text-gray-500" />
                Due Time
              </label>
              <input
                type="time"
                name="due_time"
                value={formData.due_time}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-[10px]"
              />
            </div>
            </div>
            {/* Monthly Bill */}
            <div className="grid gap-2">
              <label className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="monthly_bill">
                <DollarSign className="w-4 h-4 text-gray-500" />
                Monthly Bill ($)
              </label>
              <input
                type="number"
                name="monthly_bill"
                value={formData.monthly_bill}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-[10px]"
                id="monthly_bill"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Reminder Date */}
            <div className="flex flex-row gap-4">
            <div className="w-1/2">
              <label className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="reminder_date">
                <Bell className="w-4 h-4 text-gray-500" />
                Reminder Date
              </label>
              <input
                type="date"
                name="reminder_date"
                value={formData.reminder_date}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-[10px]"
              />
            </div>

            {/* Reminder Time */}
            <div className="w-1/2">
              <label className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="reminder_time">
                <Clock className="w-4 h-4 text-gray-500" />
                Reminder Time
              </label>
              <input
                type="time"
                name="reminder_time"
                value={formData.reminder_time}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-[10px]"
              />
            </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-zinc-100 hover:text-zinc-800 h-10 px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-white hover:bg-zinc-900/90 h-10 px-4 py-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 