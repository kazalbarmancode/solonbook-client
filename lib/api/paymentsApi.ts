
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  paymentStatus?: string;
}

interface CheckoutResponse {
  success: boolean;
  message?: string;
  url: string;
  sessionId: string;
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