import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';
import { mockBackend } from '../mockBackend';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Server API base URL
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2029a389`;

// Simple API client with mock backend fallback
export class APIClient {
  private static useMockBackend = false;
  
  // Check if we should use mock backend
  private static async shouldUseMock(): Promise<boolean> {
    if (this.useMockBackend) return true;
    
    // Try to ping the health endpoint once
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('✅ Edge Function is available');
        return false;
      }
    } catch (error) {
      console.log('⚠️ Edge Function unavailable, using mock backend');
      this.useMockBackend = true;
      return true;
    }
    
    this.useMockBackend = true;
    return true;
  }
  private static getAuthHeaders(token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }
    
    return headers;
  }

  static async post(endpoint: string, data: any, authToken?: string) {
    // Check if we should use mock backend
    const useMock = await this.shouldUseMock();
    
    if (useMock) {
      // Route to mock backend
      return this.handleMockRequest(endpoint, data, 'POST');
    }
    
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making POST request to:', url);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(authToken),
        body: JSON.stringify(data),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: `Network error: ${response.status} ${response.statusText}` 
        }));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error: any) {
      // On any error, switch to mock backend
      if (error.name === 'AbortError' || error.message === 'Failed to fetch') {
        console.log('⚠️ Request failed, switching to mock backend');
        this.useMockBackend = true;
        return this.handleMockRequest(endpoint, data, 'POST');
      }
      throw error;
    }
  }
  
  // Handle mock backend requests
  private static async handleMockRequest(endpoint: string, data: any, method: string): Promise<any> {
    console.log(`🎭 Mock backend handling ${method} ${endpoint}`);
    
    // GET endpoints
    if (method === 'GET') {
      if (endpoint === '/classes') {
        return mockBackend.getClasses();
      }
      if (endpoint === '/sessions') {
        return mockBackend.getSessions();
      }
      if (endpoint === '/bookings') {
        return mockBackend.getBookings();
      }
      if (endpoint === '/user-classes') {
        return mockBackend.getUserClasses();
      }
      if (endpoint === '/profile') {
        return mockBackend.getProfile();
      }
      if (endpoint === '/doctors/sessions') {
        return mockBackend.getDoctorSessions();
      }
      // Default GET response
      return { data: [], success: true };
    }
    
    // POST endpoints - Payment endpoints
    if (endpoint === '/payments/paypal/create') {
      return mockBackend.createPayPalPayment(data);
    }
    
    if (endpoint.match(/\/payments\/paypal\/.*\/capture/)) {
      const paymentId = endpoint.split('/')[3]; // Index 3 because endpoint is /payments/paypal/{paymentId}/capture
      return mockBackend.capturePayPalPayment(paymentId, data.paypalOrderId);
    }
    
    if (endpoint === '/payments/create-intent') {
      return mockBackend.createPaymentIntent(data);
    }
    
    if (endpoint.match(/\/payments\/.*\/confirm/)) {
      const paymentId = endpoint.split('/')[2];
      return mockBackend.confirmPayment(paymentId, data.paymentMethodId);
    }
    
    // Booking endpoints
    if (endpoint.match(/\/sessions\/.*\/book/) || endpoint.match(/\/classes\/.*\/book/) || endpoint.match(/\/doctors\/.*\/book/)) {
      return mockBackend.createBooking({
        ...data,
        userId: 'mock_user'
      });
    }
    
    // Profile endpoints
    if (endpoint === '/profile/complete') {
      return mockBackend.updateProfile(data);
    }
    
    // ML endpoints
    if (endpoint === '/ml/predict-anxiety') {
      return mockBackend.predictAnxiety(data);
    }
    
    // Default mock response
    return {
      message: 'Mock response',
      data: data,
      success: true
    };
  }

  static async get(endpoint: string, authToken?: string) {
    // Check if we should use mock backend
    const useMock = await this.shouldUseMock();
    
    if (useMock) {
      // Route to mock backend
      return this.handleMockRequest(endpoint, {}, 'GET');
    }
    
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making GET request to:', url);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(authToken),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: `Network error: ${response.status} ${response.statusText}` 
        }));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error: any) {
      // On any error, switch to mock backend
      if (error.name === 'AbortError' || error.message === 'Failed to fetch') {
        console.log('⚠️ Request failed, switching to mock backend');
        this.useMockBackend = true;
        return this.handleMockRequest(endpoint, {}, 'GET');
      }
      throw error;
    }
  }

  static async put(endpoint: string, data: any, authToken?: string) {
    // Check if we should use mock backend
    const useMock = await this.shouldUseMock();
    
    if (useMock) {
      // Route to mock backend
      return this.handleMockRequest(endpoint, data, 'PUT');
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(authToken),
        body: JSON.stringify(data),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      // On any error, switch to mock backend
      if (error.name === 'AbortError' || error.message === 'Failed to fetch') {
        console.log('⚠️ Request failed, switching to mock backend');
        this.useMockBackend = true;
        return this.handleMockRequest(endpoint, data, 'PUT');
      }
      throw error;
    }
  }
}