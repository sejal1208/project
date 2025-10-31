import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent } from '../ui/card';
import { Calendar as CalendarIcon, Clock, User, CreditCard, CheckCircle, AlertCircle, Star } from 'lucide-react';
// Date formatting utility
const formatDate = (date: Date, formatStr: string) => {
  const options: Intl.DateTimeFormatOptions = {};
  
  if (formatStr === 'yyyy-MM-dd') {
    return date.toISOString().split('T')[0];
  }
  
  if (formatStr === 'PPP') {
    options.weekday = 'long';
    options.year = 'numeric';
    options.month = 'long';
    options.day = 'numeric';
    return date.toLocaleDateString('en-US', options);
  }
  
  if (formatStr === 'EEEE, MMMM dd, yyyy') {
    options.weekday = 'long';
    options.year = 'numeric';
    options.month = 'long';
    options.day = 'numeric';
    return date.toLocaleDateString('en-US', options);
  }
  
  return date.toLocaleDateString();
};
import { APIClient } from '../../utils/supabase/client';
import { useAuth } from '../auth/AuthProvider';
import { PaymentModal } from '../payments/PaymentModal';

interface Doctor {
  id: number;
  name: string;
  image: string;
  specialties: string[];
  tradition: string;
  rating: number;
  reviews: number;
  experience: string;
  location: string;
  availability: string;
  languages: string[];
  description: string;
  sessionPrice: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
}

export function BookingModal({ isOpen, onClose, doctor }: BookingModalProps) {
  const { user, getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<'booking' | 'payment'>('booking');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [bookingForm, setBookingForm] = useState({
    sessionType: '',
    timeSlot: '',
    duration: '60',
    notes: '',
    urgency: 'normal'
  });

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  const sessionTypes = [
    { value: 'consultation', label: 'General Consultation', price: parseInt(doctor.sessionPrice.replace(/[₹,]/g, '')) },
    { value: 'anxiety', label: 'Anxiety Support Session', price: parseInt(doctor.sessionPrice.replace(/[₹,]/g, '')) + 200 },
    { value: 'meditation', label: 'Guided Meditation', price: parseInt(doctor.sessionPrice.replace(/[₹,]/g, '')) - 300 },
    { value: 'spiritual', label: 'Spiritual Guidance', price: parseInt(doctor.sessionPrice.replace(/[₹,]/g, '')) + 100 },
    { value: 'workshop', label: 'Personal Workshop', price: parseInt(doctor.sessionPrice.replace(/[₹,]/g, '')) + 500 }
  ];

  const resetForm = () => {
    setSelectedDate(undefined);
    setBookingForm({
      sessionType: '',
      timeSlot: '',
      duration: '60',
      notes: '',
      urgency: 'normal'
    });
    setError('');
    setSuccess(false);
    setStep('booking');
    setBookingResult(null);
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const getSessionPrice = () => {
    const selectedType = sessionTypes.find(type => type.value === bookingForm.sessionType);
    return selectedType ? selectedType.price : parseInt(doctor.sessionPrice.replace(/[₹,]/g, ''));
  };

  const validateBooking = () => {
    if (!selectedDate) return 'Please select a date';
    if (!bookingForm.sessionType) return 'Please select a session type';
    if (!bookingForm.timeSlot) return 'Please select a time slot';
    return null;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateBooking();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user) {
      setError('Please sign in to book a session');
      return;
    }

    // Don't create booking yet - just proceed to payment
    // Create a temporary booking object for payment
    const tempBooking = {
      id: `temp_${Date.now()}`,
      doctorId: doctor.id,
      sessionDate: formatDate(selectedDate!, 'yyyy-MM-dd'),
      sessionTime: bookingForm.timeSlot,
      sessionType: bookingForm.sessionType,
      duration: bookingForm.duration,
      notes: bookingForm.notes,
      urgency: bookingForm.urgency
    };

    setBookingResult(tempBooking);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async () => {
    setPaymentModalOpen(false);
    setLoading(true);
    
    try {
      // NOW create the actual booking after payment success
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const result = await APIClient.post(`/doctors/${doctor.id}/book`, {
        sessionDate: bookingResult.sessionDate,
        sessionTime: bookingResult.sessionTime,
        sessionType: bookingResult.sessionType,
        duration: bookingResult.duration,
        notes: bookingResult.notes,
        urgency: bookingResult.urgency
      }, token);

      setBookingResult(result.session);
      setSuccess(true);
      
      // Trigger dashboard refresh by dispatching a custom event
      window.dispatchEvent(new CustomEvent('bookingCreated', { 
        detail: result.session 
      }));
      
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err: any) {
      setError('Payment successful but booking failed. Please contact support.');
      console.error('Post-payment booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30); // 30 days from now
    return date < today || date > maxDate;
  };

  if (success && !paymentModalOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="sr-only">Booking Confirmation</DialogTitle>
            <DialogDescription className="sr-only">Your session has been successfully booked and confirmed</DialogDescription>
          </DialogHeader>
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl text-slate-800">Booking Confirmed!</h3>
            <p className="text-slate-600">
              Your session with {doctor.name} has been successfully booked and paid for.
            </p>
            {bookingResult && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-sm text-green-800">
                  <p><strong>Date:</strong> {formatDate(selectedDate!, 'EEEE, MMMM dd, yyyy')}</p>
                  <p><strong>Time:</strong> {bookingForm.timeSlot}</p>
                  <p><strong>Type:</strong> {sessionTypes.find(t => t.value === bookingForm.sessionType)?.label}</p>
                </CardContent>
              </Card>
            )}
            <Button onClick={handleClose} className="bg-teal-600 hover:bg-teal-700">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-slate-800">
              Book Session with {doctor.name}
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600">
              Schedule your spiritual guidance session and complete payment
            </DialogDescription>
          </DialogHeader>

          {/* Doctor Summary */}
          <Card className="bg-teal-50 border-teal-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg text-slate-800">{doctor.name}</h3>
                  <p className="text-sm text-slate-600">{doctor.tradition}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm">{doctor.rating} ({doctor.reviews} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Starting from</p>
                  <p className="text-lg text-teal-700">{doctor.sessionPrice}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleBooking} className="space-y-6">
            {/* Session Type */}
            <div className="space-y-2">
              <Label htmlFor="sessionType">Session Type *</Label>
              <Select value={bookingForm.sessionType} onValueChange={(value) => 
                setBookingForm(prev => ({ ...prev, sessionType: value }))
              }>
                <SelectTrigger className="border-teal-200">
                  <SelectValue placeholder="Choose session type" />
                </SelectTrigger>
                <SelectContent>
                  {sessionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{type.label}</span>
                        <span className="ml-4 text-teal-600">₹{type.price.toLocaleString()}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Select Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-teal-200"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? formatDate(selectedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Slot */}
            <div className="space-y-2">
              <Label htmlFor="timeSlot">Preferred Time *</Label>
              <Select value={bookingForm.timeSlot} onValueChange={(value) => 
                setBookingForm(prev => ({ ...prev, timeSlot: value }))
              }>
                <SelectTrigger className="border-teal-200">
                  <SelectValue placeholder="Choose time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Session Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Session Duration (minutes)</Label>
              <Select value={bookingForm.duration} onValueChange={(value) => 
                setBookingForm(prev => ({ ...prev, duration: value }))
              }>
                <SelectTrigger className="border-teal-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Urgency */}
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select value={bookingForm.urgency} onValueChange={(value) => 
                setBookingForm(prev => ({ ...prev, urgency: value }))
              }>
                <SelectTrigger className="border-teal-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - General consultation</SelectItem>
                  <SelectItem value="normal">Normal - Regular session</SelectItem>
                  <SelectItem value="high">High - Urgent support needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any specific concerns or topics you'd like to discuss..."
                value={bookingForm.notes}
                onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                className="border-teal-200 focus:border-teal-400"
              />
            </div>

            {/* Price Summary */}
            {bookingForm.sessionType && (
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Session Price:</span>
                    <span className="text-xl text-slate-800">₹{getSessionPrice().toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {bookingForm.duration} minute session • {sessionTypes.find(t => t.value === bookingForm.sessionType)?.label}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Error Message */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-2 bg-teal-600 hover:bg-teal-700 text-white"
                disabled={loading || !user}
              >
                {loading ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin mr-2" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Book & Pay ₹{bookingForm.sessionType ? getSessionPrice().toLocaleString() : '0'}
                  </>
                )}
              </Button>
            </div>

            {!user && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <User className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Please sign in to book a session with this spiritual doctor.
                </AlertDescription>
              </Alert>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      {bookingResult && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          bookingDetails={{
            id: bookingResult.id,
            type: 'session',
            title: `Session with ${doctor.name}`,
            amount: getSessionPrice(),
            currency: 'INR',
            description: `${sessionTypes.find(t => t.value === bookingForm.sessionType)?.label} - ${formatDate(selectedDate!, 'PPP')} at ${bookingForm.timeSlot}`
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}