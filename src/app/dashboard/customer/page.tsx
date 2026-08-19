import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { CheckoutButton } from "@/components/payment/checkout-button";

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user as any;
  if (user.role !== "CUSTOMER" && user.role !== "SUPER_ADMIN") {
    redirect("/dashboard/sitter");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      customerId: user.id,
    },
    include: {
      serviceType: true,
      assignments: {
        include: {
          sitter: {
            include: {
              user: true,
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
      <div className="mb-8">
        <Link href="/services" className="bg-blue-600 text-white px-4 py-2 rounded">
          Book a Sitter
        </Link>
      </div>
      <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">You have no bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const primaryAssignment = booking.assignments.find(a => a.type === "PRIMARY");
            const sitterName = primaryAssignment?.sitter?.user?.displayName || "Pending Assignment";
            
            return (
              <div key={booking.id} className="border p-4 rounded shadow-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{booking.serviceType.name}</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm">{booking.status}</span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  <p>Sitter: {sitterName}</p>
                  <p>Start: {new Date(booking.scheduledStart).toLocaleString()}</p>
                  <p>End: {new Date(booking.scheduledEnd).toLocaleString()}</p>
                </div>
                {booking.status === "PAYMENT_PENDING" && (
                  <div className="mt-4">
                    <CheckoutButton bookingId={booking.id} amount={booking.quoteAmountPaise} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
