// Mock Backend Service - Client-side fallback when Edge Function isn't available
// This allows the app to work without a deployed Supabase Edge Function

interface Payment {
  id: string;
  userId: string;
  bookingId: string;
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'succeeded' | 'failed';
  paymentMethod: 'card' | 'paypal';
  createdAt: string;
  approvalUrl?: string;
  paypalOrderId?: string;
}

interface Booking {
  id: string;
  userId: string;
  classId?: string;
  sessionId?: string;
  bookedAt: string;
  status: 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed';
}

class MockBackend {
  private payments: Map<string, Payment> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private userId: string = 'mock_user_' + Date.now();
  private profile: any = null;

  // Get all classes
  async getClasses(): Promise<any> {
    console.log('🎭 Mock: Getting classes');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      classes: [
        {
          id: 'class_1',
          title: "Brain Gym Morning Session",
          instructor: "Uncle Raj",
          instructorId: "instructor_1",
          time: "9:00 AM - 9:45 AM",
          ageGroup: "6-10 years",
          participants: 12,
          maxParticipants: 15,
          day: "Monday",
          type: "Brain Gym",
          difficulty: "Beginner",
          description: "Fun exercises to boost memory and focus through movement and games",
          price: 500,
          recurring: true
        },
        {
          id: 'class_2',
          title: "Little Yogis Meditation",
          instructor: "Aunt Priya",
          instructorId: "instructor_2",
          time: "4:00 PM - 4:30 PM",
          ageGroup: "4-8 years",
          participants: 8,
          maxParticipants: 12,
          day: "Tuesday",
          type: "Meditation",
          difficulty: "Beginner",
          description: "Gentle meditation and breathing exercises for young minds",
          price: 400,
          recurring: true
        }
      ]
    };
  }

  // Get all sessions
  async getSessions(): Promise<any> {
    console.log('🎭 Mock: Getting sessions');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      sessions: []
    };
  }

  // Get user bookings
  async getBookings(): Promise<any> {
    console.log('🎭 Mock: Getting bookings');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const bookings = Array.from(this.bookings.values());
    return { bookings };
  }

  // Get user classes
  async getUserClasses(): Promise<any> {
    console.log('🎭 Mock: Getting user classes');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      classes: []
    };
  }

  // Get doctor sessions
  async getDoctorSessions(): Promise<any> {
    console.log('🎭 Mock: Getting doctor sessions');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      sessions: [
        {
          id: 'session_1',
          userId: 'patient_001',
          sessionType: 'Anxiety Management',
          sessionDate: new Date().toISOString().split('T')[0],
          sessionTime: '10:00',
          status: 'scheduled'
        },
        {
          id: 'session_2',
          userId: 'patient_002',
          sessionType: 'Meditation Session',
          sessionDate: new Date().toISOString().split('T')[0],
          sessionTime: '11:30',
          status: 'scheduled'
        }
      ]
    };
  }

  // Predict anxiety level using ML
  async predictAnxiety(data: { stress: number; sleep: number; overwhelmed: boolean }): Promise<any> {
    console.log('🎭 Mock: Predicting anxiety level', data);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate ML processing time
    
    // Simple ML-like logic for demo
    let score = 0;
    
    // Stress contribution (0-40 points)
    score += (data.stress / 10) * 40;
    
    // Sleep contribution (0-30 points) - inverted (less sleep = higher anxiety)
    const optimalSleep = 7.5;
    const sleepDeviation = Math.abs(data.sleep - optimalSleep);
    score += (sleepDeviation / optimalSleep) * 30;
    
    // Overwhelmed contribution (0-30 points)
    if (data.overwhelmed) {
      score += 30;
    }
    
    // Normalize to 0-100
    score = Math.min(100, Math.max(0, score));
    
    // Determine level
    let anxietyLevel: 'low' | 'moderate' | 'high';
    let recommendations: string[];
    
    if (score < 35) {
      anxietyLevel = 'low';
      recommendations = [
        'Maintain your current healthy habits',
        'Continue regular sleep schedule',
        'Practice daily mindfulness for prevention',
        'Stay connected with support network'
      ];
    } else if (score < 65) {
      anxietyLevel = 'moderate';
      recommendations = [
        'Consider booking a session with one of our spiritual doctors',
        'Practice daily meditation (15-20 minutes)',
        'Improve sleep hygiene - aim for 7-9 hours',
        'Try breathing exercises when feeling stressed',
        'Engage in regular physical activity'
      ];
    } else {
      anxietyLevel = 'high';
      recommendations = [
        '⚠️ We recommend booking an immediate consultation with a doctor',
        'Practice grounding techniques (5-4-3-2-1 method)',
        'Reach out to a trusted friend or family member',
        'Consider professional counseling services',
        'Use our guided meditation resources in the Kids Zone',
        'Avoid caffeine and maintain regular meals'
      ];
    }
    
    return {
      prediction: {
        anxietyLevel,
        score: Math.round(score),
        recommendations,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Get user profile
  async getProfile(): Promise<any> {
    console.log('🎭 Mock: Getting profile');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!this.profile) {
      this.profile = {
        id: this.userId,
        email: 'demo@soulcare.com',
        fullName: 'Demo User',
        phone: '+91 9876543210',
        profileComplete: false,
        joinedAt: new Date().toISOString()
      };
    }
    
    return { profile: this.profile };
  }

  // Update profile
  async updateProfile(data: any): Promise<any> {
    console.log('🎭 Mock: Updating profile');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.profile = {
      ...this.profile,
      ...data,
      profileComplete: true,
      updatedAt: new Date().toISOString()
    };
    
    return {
      message: 'Profile updated successfully',
      profile: this.profile
    };
  }

  // Simulate PayPal payment creation
  async createPayPalPayment(data: {
    amount: number;
    currency: string;
    bookingId: string;
    description: string;
  }): Promise<any> {
    console.log('🎭 Using mock PayPal payment (Edge Function not available)');
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const paymentId = `mock_payment_${Date.now()}`;
    const paypalOrderId = `PAYPAL_${Date.now()}`;
    
    const payment: Payment = {
      id: paymentId,
      userId: this.userId,
      bookingId: data.bookingId,
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      status: 'pending',
      paymentMethod: 'paypal',
      paypalOrderId,
      createdAt: new Date().toISOString(),
    };
    
    this.payments.set(paymentId, payment);
    
    // Return success with mock approval
    return {
      payment: {
        id: paymentId,
        status: 'pending',
        paypalOrderId,
        // For demo, automatically mark as succeeded
        approvalUrl: null,
      }
    };
  }

  // Simulate PayPal payment capture
  async capturePayPalPayment(paymentId: string, paypalOrderId: string): Promise<any> {
    console.log('🎭 Using mock PayPal capture (Edge Function not available)');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    payment.status = 'succeeded';
    this.payments.set(paymentId, payment);
    
    // Update booking payment status
    const booking = this.bookings.get(payment.bookingId);
    if (booking) {
      booking.paymentStatus = 'completed';
      this.bookings.set(payment.bookingId, booking);
    }
    
    return {
      payment: {
        ...payment,
        status: 'succeeded'
      }
    };
  }

  // Simulate payment intent creation (for card payments)
  async createPaymentIntent(data: {
    amount: number;
    currency: string;
    bookingId: string;
    description: string;
  }): Promise<any> {
    console.log('🎭 Using mock payment intent (Edge Function not available)');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const paymentId = `mock_payment_${Date.now()}`;
    
    const payment: Payment = {
      id: paymentId,
      userId: this.userId,
      bookingId: data.bookingId,
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      status: 'pending',
      paymentMethod: 'card',
      createdAt: new Date().toISOString(),
    };
    
    this.payments.set(paymentId, payment);
    
    return {
      payment: {
        id: paymentId,
        status: 'pending',
        clientSecret: `mock_secret_${Date.now()}`
      }
    };
  }

  // Simulate payment confirmation
  async confirmPayment(paymentId: string, paymentMethodId: string): Promise<any> {
    console.log('🎭 Using mock payment confirmation (Edge Function not available)');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    // Simulate successful payment
    payment.status = 'succeeded';
    this.payments.set(paymentId, payment);
    
    // Update booking payment status
    const booking = this.bookings.get(payment.bookingId);
    if (booking) {
      booking.paymentStatus = 'completed';
      this.bookings.set(payment.bookingId, booking);
    }
    
    return {
      payment: {
        ...payment,
        status: 'succeeded'
      }
    };
  }

  // Simulate booking creation
  async createBooking(data: {
    classId?: string;
    sessionId?: string;
    userId: string;
  }): Promise<any> {
    console.log('🎭 Using mock booking creation (Edge Function not available)');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const bookingId = `mock_booking_${Date.now()}`;
    
    const booking: Booking = {
      id: bookingId,
      userId: data.userId,
      classId: data.classId,
      sessionId: data.sessionId,
      bookedAt: new Date().toISOString(),
      status: 'confirmed',
      paymentStatus: 'pending'
    };
    
    this.bookings.set(bookingId, booking);
    
    return {
      message: 'Booking created successfully (mock)',
      booking
    };
  }
}

export const mockBackend = new MockBackend();
