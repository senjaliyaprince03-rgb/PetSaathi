"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CheckoutButton({
  bookingId,
  amount,
  label = "Pay Now",
}: {
  bookingId: string;
  amount: number;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Create Order
      const res = await fetch(`/api/bookings/${bookingId}/payment-order`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to initialize payment");
      }

      const data = await res.json();
      const { order, keyId } = data;

      // 2. Load Razorpay script if not loaded
      if (!(window as any).Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      // 3. Open Razorpay Checkout
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "PetSaathi",
        description: "Booking Payment",
        handler: async function (response: any) {
          // 4. Verify payment
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              router.refresh();
            } else {
              setError("Payment verification failed");
            }
          } catch (e) {
            setError("Something went wrong during verification");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(response.error.description || "Payment failed");
      });
      rzp.open();
    } catch (e: any) {
      setError(e.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : label}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
