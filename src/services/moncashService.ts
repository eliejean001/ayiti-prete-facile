
// MonCash API integration service
// Documentation: https://sandbox.moncashbutton.digicelgroup.com/Moncash-business/resources/doc/

// MonCash API configuration
const MONCASH_CONFIG = {
  clientId: import.meta.env.VITE_MONCASH_CLIENT_ID || "your_client_id", // Replace in production
  clientSecret: import.meta.env.VITE_MONCASH_CLIENT_SECRET || "your_client_secret", // Replace in production
  baseUrl: "https://sandbox.moncashbutton.digicelgroup.com/Api", // Sandbox URL, change to production when ready
  redirectUrl: window.location.origin + "/payment-callback", // Redirect URL after payment
  version: "v1"
};

// Payment request data interface
export interface PaymentRequest {
  amount: number;
  orderId: string;
  reference: string;
}

// Payment response interface
export interface PaymentResponse {
  mode: string;
  path: string;
  payment_token: {
    created: string;
    expired: string;
    token: string;
  };
  status: number;
  timestamp: number;
}

// Payment verification interface
export interface PaymentVerification {
  payment: {
    reference: string;
    transaction_id: string;
    cost: number;
    message: string;
    status: "PENDING" | "SUCCESSFUL" | "FAILED";
  };
}

// Get authentication token
const getAuthToken = async (): Promise<string> => {
  try {
    const credentials = btoa(`${MONCASH_CONFIG.clientId}:${MONCASH_CONFIG.clientSecret}`);
    
    const response = await fetch(`${MONCASH_CONFIG.baseUrl}/${MONCASH_CONFIG.version}/oauth/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: 'scope=read,write&grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Failed to get auth token: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("MonCash Authentication Error:", error);
    throw new Error("Failed to authenticate with MonCash. Please try again later.");
  }
};

// Create a payment request
export const createPayment = async (paymentDetails: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${MONCASH_CONFIG.baseUrl}/${MONCASH_CONFIG.version}/CreatePayment`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: paymentDetails.amount,
        orderId: paymentDetails.orderId,
        reference: paymentDetails.reference
      })
    });

    if (!response.ok) {
      throw new Error(`Payment request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("MonCash Payment Creation Error:", error);
    throw new Error("Failed to create payment request. Please try again later.");
  }
};

// Verify payment status
export const verifyPayment = async (transactionId: string): Promise<PaymentVerification> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${MONCASH_CONFIG.baseUrl}/${MONCASH_CONFIG.version}/RetrieveTransactionPayment`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        transactionId
      })
    });

    if (!response.ok) {
      throw new Error(`Payment verification failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("MonCash Payment Verification Error:", error);
    throw new Error("Failed to verify payment status. Please check your MonCash app for confirmation.");
  }
};

// Generate MonCash payment URL
export const getPaymentUrl = (paymentToken: string): string => {
  return `${MONCASH_CONFIG.baseUrl}/${MONCASH_CONFIG.version}/Redirect?token=${paymentToken}`;
};

// Generate a unique order ID based on timestamp and random string
export const generateOrderId = (): string => {
  return `AYL-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
};

