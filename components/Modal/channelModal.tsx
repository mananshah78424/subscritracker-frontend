import React, { useState, FormEvent } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  Bell,
  CalendarClock,
  X,
  Sparkles,
} from 'lucide-react';

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
};

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel | null;
  submitHandlerFromParent?: (data: SubscriptionFormData) => void;
}

interface SubscriptionFormData {
  start_date: string;
  start_time: string;
  due_date: string;
  due_time: string;
  monthly_bill: number;
  reminder_date: string;
  reminder_time: string;
}

const FormSection = ({ icon: Icon, title, children }: { 
  icon: React.ElementType; 
  title: string; 
  children: React.ReactNode 
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <div className="p-1.5 bg-blue-100 rounded-lg">
        <Icon className="h-4 w-4 text-blue-600" />
      </div>
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
    </div>
    <div className="space-y-3 pl-6">
      {children}
    </div>
  </div>
);

const FormField = ({ 
  label, 
  type, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  step,
  min
}: {
  label: string;
  type: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  step?: string;
  min?: string;
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      step={step}
      min={min}
      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all duration-200 outline-none"
    />
  </div>
);

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
    const { name, value, type } = e.target;
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
      } else {
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-fadeInScale border border-gray-100 flex flex-col">

        {/* Channel Info */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={channel.channel_image_url}
                alt={channel.channel_name}
                className="w-14 h-14 rounded-xl object-cover shadow-lg ring-2 ring-white"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-lg">{channel.channel_name}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {channel.channel_description}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className={`p-6 space-y-6 bg-white ${
              isLoading ? 'opacity-60 pointer-events-none' : ''
            }`}
          >
            {/* Subscription Period */}
            <FormSection icon={Calendar} title="Subscription Period">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Start Date"
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="Start Time"
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Due Date"
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="Due Time"
                  type="time"
                  name="due_time"
                  value={formData.due_time}
                  onChange={handleInputChange}
                />
              </div>
            </FormSection>

            {/* Billing */}
            <FormSection icon={DollarSign} title="Billing Information">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input
                  type="number"
                  name="monthly_bill"
                  value={formData.monthly_bill}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-4 py-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all duration-200 outline-none"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </FormSection>

            {/* Reminders */}
            <FormSection icon={Bell} title="Reminder Settings">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Reminder Date"
                  type="date"
                  name="reminder_date"
                  value={formData.reminder_date}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Reminder Time"
                  type="time"
                  name="reminder_time"
                  value={formData.reminder_time}
                  onChange={handleInputChange}
                />
              </div>
            </FormSection>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold transition-all duration-200 h-12 hover:shadow-md"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all h-10"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 
                    0 5.373 0 12h4zm2 5.291A7.962 
                    7.962 0 014 12H0c0 3.042 1.135 
                    5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoading ? 'Saving...' : 'Subscribe'}
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* Tailwind animation */
<style jsx global>{`
@keyframes fadeInScale {
  from { 
    opacity: 0; 
    transform: scale(0.95) translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: scale(1) translateY(0); 
  }
}
.animate-fadeInScale {
  animation: fadeInScale 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
`}</style>