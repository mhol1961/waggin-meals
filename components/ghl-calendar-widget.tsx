'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

/**
 * GoHighLevel Calendar Widget Component
 *
 * This component displays an appointment booking widget that integrates
 * with GoHighLevel's calendar system.
 *
 * USAGE:
 * Import and use this component on any page where you want to offer appointment booking:
 *
 * import { GHLCalendarWidget } from '@/components/ghl-calendar-widget';
 *
 * <GHLCalendarWidget
 *   appointmentType="Nutrition Consultation - $395"
 *   duration={60}
 * />
 *
 * SETUP:
 * 1. Configure GHL API credentials in .env.local
 * 2. Set GHL_ENABLED=true when ready to go live
 * 3. The widget will show placeholder mode until GHL is configured
 */

interface GHLCalendarWidgetProps {
  appointmentType?: string;
  duration?: number; // in minutes
  className?: string;
}

export function GHLCalendarWidget({
  appointmentType = 'Nutrition Consultation - $395',
  duration = 60,
  className = ''
}: GHLCalendarWidgetProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/ghl/booking?date=${date}&timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
      const data = await response.json();

      if (data.success) {
        setAvailableSlots(data.availableSlots || []);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/ghl/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          appointmentType,
          selectedDate,
          selectedTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      });

      const data = await response.json();

      if (data.success) {
        setBookingStatus('success');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          notes: ''
        });
        setSelectedDate('');
        setSelectedTime('');
      } else {
        setBookingStatus('error');
        setErrorMessage(data.error || 'Failed to book appointment');
      }
    } catch (error) {
      setBookingStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`bg-white rounded-lg shadow-xl p-8 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#a5b5eb] rounded-full flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Book Your Consultation
          </h3>
          <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {appointmentType} • {duration} minutes
          </p>
        </div>
      </div>

      {bookingStatus === 'success' ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
            ✓
          </div>
          <h4 className="text-xl font-semibold text-green-800 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Appointment Booked!
          </h4>
          <p className="text-green-700 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            You'll receive a confirmation email shortly with all the details.
          </p>
          <button
            onClick={() => setBookingStatus('idle')}
            className="bg-[#a5b5eb] text-white px-6 py-2 rounded-lg hover:bg-[#8a9fd9] transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Book Another Appointment
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Select Date *
            </label>
            <input
              type="date"
              required
              min={today}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime(''); // Reset time when date changes
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
          </div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Select Time *
              </label>
              {loading ? (
                <div className="text-center py-4 text-[#666666]">
                  Loading available times...
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedTime === slot
                          ? 'bg-[#a5b5eb] text-white border-[#a5b5eb]'
                          : 'bg-white text-[#3c3a47] border-gray-300 hover:border-[#a5b5eb]'
                      }`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-[#666666] bg-gray-50 rounded-lg">
                  No available time slots for this date
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              placeholder="Tell us about your dog and what you'd like help with..."
            />
          </div>

          {/* Error Message */}
          {bookingStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={bookingStatus === 'loading' || !selectedDate || !selectedTime}
            className="w-full bg-[#a5b5eb] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#8a9fd9] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {bookingStatus === 'loading' ? 'Booking...' : `Book ${appointmentType}`}
          </button>

          <p className="text-xs text-center text-[#999999]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            By booking, you agree to our terms of service and privacy policy.
          </p>
        </form>
      )}
    </div>
  );
}
