import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Loader2, CreditCard, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { APIClient } from '../../utils/supabase/client';
import { useAuth } from '../auth/AuthProvider';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    id: string;
    type: 'session' | 'class';
    title: string;
    amount: number;
    currency: string;
    description: string;
  };
  onPaymentSuccess?: () => void;
}

export function PaymentModal({ isOpen, onClose, bookingDetails, onPaymentSuccess }: PaymentModalProps) {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'complete'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const paypalTriggeredRef = useRef(false);

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    country: 'IN'
  });

  const resetForm = () => {
    setPaymentForm({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      billingAddress: '',
      city: '',
      postalCode: '',
      country: 'IN'
    });
    setError('');
    setSuccess(false);
    setPaymentStep('details');
    setPaymentMethod('card');
    setPaypalOrderId(null);
    paypalTriggeredRef.current = false;
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateCard = () => {
    const cardNumber = paymentForm.cardNumber.replace(/\s/g, '');
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      return 'Invalid card number length';
    }

    if (!paymentForm.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      return 'Invalid expiry date format (MM/YY)';
    }

    if (paymentForm.cvv.length < 3 || paymentForm.cvv.length > 4) {
      return 'Invalid CVV';
    }

    if (!paymentForm.cardholderName.trim()) {
      return 'Cardholder name is required';
    }

    return null;
  };

  const handlePayPalPayment = async () => {
    setError('');
    setLoading(true);
    setPaymentStep('processing');

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Please sign in to continue');
      }

      // Convert INR to USD for PayPal (approximate rate: 1 USD = 83 INR)
      const usdAmount = bookingDetails.currency === 'INR' 
        ? Math.ceil(bookingDetails.amount / 83) 
        : bookingDetails.amount;
      
      console.log(`Converting ₹${bookingDetails.amount} to ${usdAmount} for PayPal`);
      
      const paymentResult = await APIClient.post('/payments/paypal/create', {
        amount: usdAmount,
        currency: 'USD',
        bookingId: bookingDetails.id,
        description: `${bookingDetails.description} (Originally ₹${bookingDetails.amount})`
      }, token);

      // Check if using mock backend (no approval URL)
      if (!paymentResult.payment.approvalUrl) {
        console.log('🎭 Using mock PayPal payment - auto-completing');
        setPaypalOrderId(paymentResult.payment.paypalOrderId);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Auto-complete for mock
        await handlePayPalCapture(paymentResult.payment.id);
        return;
      }

      // Real PayPal flow
      if (paymentResult.payment.approvalUrl) {
        setPaypalOrderId(paymentResult.payment.paypalOrderId);
        
        console.log('Opening PayPal:', paymentResult.payment.approvalUrl);
        
        // Open PayPal portal
        const paypalWindow = window.open(
          paymentResult.payment.approvalUrl, 
          'paypal_checkout', 
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );
        
        if (!paypalWindow) {
          throw new Error('PayPal popup was blocked. Please allow popups and try again.');
        }
        
        // Listen for PayPal approval
        const checkPaypal = setInterval(async () => {
          if (paypalWindow?.closed) {
            clearInterval(checkPaypal);
            await handlePayPalCapture(paymentResult.payment.id);
          }
        }, 1000);
        
        // Add timeout (10 minutes)
        setTimeout(() => {
          clearInterval(checkPaypal);
          if (!paypalWindow.closed) {
            paypalWindow.close();
          }
          if (paymentStep === 'processing') {
            handlePayPalCapture(paymentResult.payment.id);
          }
        }, 600000);
      }

    } catch (err: any) {
      console.error('PayPal payment error:', err.message);
      setError(`PayPal error: ${err.message}. Please try card payment instead.`);
      setPaymentStep('details');
      setLoading(false);
    }
  };

  const handlePayPalCapture = async (paymentId: string) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Invalid payment session');
      }

      const captureResult = await APIClient.post(`/payments/paypal/${paymentId}/capture`, {
        paypalOrderId: paypalOrderId || `mock_order_${Date.now()}`
      }, token);

      if (captureResult.payment.status === 'succeeded') {
        setPaymentStep('complete');
        setSuccess(true);
        onPaymentSuccess?.();
        
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        throw new Error('PayPal payment was not completed');
      }

    } catch (err: any) {
      console.error('PayPal capture error:', err);
      setError(err.message);
      setPaymentStep('details');
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateCard();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setPaymentStep('processing');

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Please sign in to continue');
      }

      // Step 1: Create payment intent
      const paymentIntent = await APIClient.post('/payments/create-intent', {
        amount: bookingDetails.amount,
        currency: bookingDetails.currency,
        bookingId: bookingDetails.id,
        description: bookingDetails.description
      }, token);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 2: Confirm payment
      const paymentResult = await APIClient.post(`/payments/${paymentIntent.payment.id}/confirm`, {
        paymentMethodId: `pm_${Date.now()}_demo` // Demo payment method ID
      }, token);

      if (paymentResult.payment.status === 'succeeded') {
        setPaymentStep('complete');
        setSuccess(true);
        onPaymentSuccess?.();
        
        // Auto-close after success
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        throw new Error(paymentResult.payment.failureReason || 'Payment failed');
      }

    } catch (err: any) {
      setError(err.message);
      setPaymentStep('details');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentDetails = () => (
    <div className="space-y-6">
      {/* Booking Summary */}
      <Card className="bg-teal-50 border-teal-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-slate-800">{bookingDetails.title}</h4>
            <span className="text-lg font-bold text-teal-700">
              ₹{bookingDetails.amount.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-slate-600">{bookingDetails.description}</p>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Tabs value={paymentMethod} onValueChange={(value) => {
        setPaymentMethod(value as 'card' | 'paypal');
        // Auto-trigger PayPal when selected
        if (value === 'paypal' && !paypalTriggeredRef.current) {
          paypalTriggeredRef.current = true;
          setTimeout(() => handlePayPalPayment(), 300);
        }
      }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="card">Credit/Debit Card</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="card" className="space-y-4">
          <form onSubmit={handleCardPayment} className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Card Information
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentForm.cardNumber}
                  onChange={(e) => setPaymentForm(prev => ({ 
                    ...prev, 
                    cardNumber: formatCardNumber(e.target.value)
                  }))}
                  maxLength={19}
                  required
                  className="border-teal-200 focus:border-teal-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={paymentForm.expiryDate}
                    onChange={(e) => setPaymentForm(prev => ({ 
                      ...prev, 
                      expiryDate: formatExpiryDate(e.target.value)
                    }))}
                    maxLength={5}
                    required
                    className="border-teal-200 focus:border-teal-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={paymentForm.cvv}
                    onChange={(e) => setPaymentForm(prev => ({ 
                      ...prev, 
                      cvv: e.target.value.replace(/\D/g, '')
                    }))}
                    maxLength={4}
                    required
                    className="border-teal-200 focus:border-teal-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={paymentForm.country} onValueChange={(value) => 
                    setPaymentForm(prev => ({ ...prev, country: value }))
                  }>
                    <SelectTrigger className="border-teal-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN">India</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="Name as shown on card"
                  value={paymentForm.cardholderName}
                  onChange={(e) => setPaymentForm(prev => ({ 
                    ...prev, 
                    cardholderName: e.target.value
                  }))}
                  required
                  className="border-teal-200 focus:border-teal-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingAddress">Billing Address</Label>
                <Input
                  id="billingAddress"
                  placeholder="Street address"
                  value={paymentForm.billingAddress}
                  onChange={(e) => setPaymentForm(prev => ({ 
                    ...prev, 
                    billingAddress: e.target.value
                  }))}
                  required
                  className="border-teal-200 focus:border-teal-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={paymentForm.city}
                    onChange={(e) => setPaymentForm(prev => ({ 
                      ...prev, 
                      city: e.target.value
                    }))}
                    required
                    className="border-teal-200 focus:border-teal-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="Postal code"
                    value={paymentForm.postalCode}
                    onChange={(e) => setPaymentForm(prev => ({ 
                      ...prev, 
                      postalCode: e.target.value
                    }))}
                    required
                    className="border-teal-200 focus:border-teal-400"
                  />
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <Alert className="border-green-200 bg-green-50">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm">
                Your payment information is encrypted and secure. We never store your card details.
              </AlertDescription>
            </Alert>

            {/* Payment Button */}
            <Button 
              type="submit" 
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-lg"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <CreditCard className="w-5 h-5 mr-2" />
              )}
              Pay ₹{bookingDetails.amount.toLocaleString()}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="paypal" className="space-y-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {loading ? (
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              ) : (
                <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 6.405-7.974 6.405h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106h4.608a.641.641 0 0 0 .633-.74l.026-.16 1.065-6.756.068-.37a.641.641 0 0 1 .633-.54h.4c3.131 0 5.583-1.27 6.294-4.942.298-1.54.144-2.825-.745-3.556z"/>
                </svg>
              )}
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              {loading ? 'Opening PayPal...' : 'Pay with PayPal'}
            </h3>
            <p className="text-slate-600 mb-6">
              {loading 
                ? 'Please wait while we redirect you to PayPal...'
                : 'Secure payment through PayPal. You\'ll be redirected automatically.'
              }
            </p>
            
            {!loading && (
              <>
                <div className="text-center text-slate-600 mb-4">
                  <p className="text-sm">Amount: <strong>₹{bookingDetails.amount.toLocaleString()}</strong></p>
                  <p className="text-xs text-slate-500">(Approximately ${bookingDetails.currency === 'INR' ? Math.ceil(bookingDetails.amount / 83) : bookingDetails.amount} USD)</p>
                </div>
                
                <Alert className="border-blue-200 bg-blue-50">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    PayPal protects your financial information with industry-leading security and fraud prevention.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center py-8 space-y-4">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
      <h3 className="text-xl text-slate-800">
        {paymentMethod === 'paypal' ? 'Processing PayPal Payment...' : 'Processing Payment...'}
      </h3>
      <p className="text-slate-600">
        {paymentMethod === 'paypal' 
          ? 'Complete your payment in the PayPal window that opened. This page will update automatically when payment is complete.'
          : 'Please wait while we securely process your payment. This may take a few moments.'
        }
      </p>
    </div>
  );

  const renderComplete = () => (
    <div className="text-center py-8 space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl text-slate-800">Payment Successful!</h3>
      <p className="text-slate-600">
        Your booking has been confirmed. You will receive a confirmation email shortly.
      </p>
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="text-sm text-green-800">
            <p><strong>Amount Paid:</strong> ₹{bookingDetails.amount.toLocaleString()}</p>
            <p><strong>Booking:</strong> {bookingDetails.title}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-slate-800">
            {paymentStep === 'details' && 'Complete Payment'}
            {paymentStep === 'processing' && 'Processing Payment'}
            {paymentStep === 'complete' && 'Payment Complete'}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600">
            {paymentStep === 'details' && 'Secure payment processing for your booking'}
            {paymentStep === 'processing' && 'Please wait while we process your payment'}
            {paymentStep === 'complete' && 'Your payment has been successfully processed'}
          </DialogDescription>
        </DialogHeader>

        {paymentStep === 'details' && renderPaymentDetails()}
        {paymentStep === 'processing' && renderProcessing()}
        {paymentStep === 'complete' && renderComplete()}

        {/* Error Message */}
        {error && paymentStep === 'details' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}