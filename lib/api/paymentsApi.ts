
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  
interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  paymentStatus?: string;
  stripePaymentStatus?: string;
}

interface CheckoutResponse {
  success: boolean;
  message?: string;
  url: string;
  sessionId: string;
}
export interface Transaction {
  _id: string;
  stripeSessionId: string;
  amount: number;
  currency: string;
  appointmentId: string;
  userId: string;
  paymentStatus: string;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  serviceName?: string;
}

interface TransactionsResponse {
  success: boolean;
  total: number;
  data: Transaction[];
}
export const createCheckoutSessionApi = async (
  appointmentId: string,
  userId: string
): Promise<CheckoutResponse> => {
  const response = await fetch(
    `${API_URL}/payments/create-checkout-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointmentId,
        userId,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to start payment"
    );
  }

  if (!result.url) {
    throw new Error("Stripe checkout URL was not returned");
  }

  return result;
};
export const verifyPaymentApi = async (
  sessionId: string
): Promise<VerifyPaymentResponse> => {
  const response = await fetch(
    `${API_URL}/payments/verify-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    }
  );

  const result: VerifyPaymentResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Payment verification failed"
    );
  }

  return result;
};
export const getAdminTransactionsApi =
  async (): Promise<TransactionsResponse> => {
    const response = await fetch(
      `${API_URL}/admin/transactions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Failed to fetch transactions"
      );
    }

    return result;
  };