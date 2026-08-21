import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { prisma } from "@/lib/db";

export default async function SitterDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user as any;
  if (user.role !== "SITTER" && user.role !== "SUPER_ADMIN") {
    redirect("/dashboard/customer" as Route);
  }

  const sitterProfile = await prisma.sitterProfile.findUnique({
    where: { userId: user.id }
  });

  if (sitterProfile && sitterProfile.status === "APPLICANT") {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center mt-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">⏳ Application Under Review</h1>
        <p className="text-lg text-gray-600 mb-4">Your employee access request is currently pending approval.</p>
        <p className="text-gray-700">Submitted: {sitterProfile.applicationAt.toLocaleString()}</p>
        <p className="text-gray-700">Expected review: Within 24 hours</p>
      </div>
    );
  }

  if (sitterProfile && sitterProfile.status === "REJECTED") {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center mt-20">
        <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Access Rejected</h1>
        <p className="text-lg text-gray-600 mb-4">Your request for Employee Dashboard access has not been approved.</p>
        <p className="text-gray-700">For assistance, contact support.</p>
      </div>
    );
  }

  // Fetch pending bookings assigned to this sitter
  const assignments = await prisma.bookingAssignment.findMany({
    where: {
      sitter: {
        userId: user.id
      },
      booking: {
        status: {
          in: ["REQUESTED", "DRAFT"] // Use whatever maps to pending for sitters
        }
      }
    },
    include: {
      booking: {
        include: {
          serviceType: true,
          customer: true
        }
      }
    },
    orderBy: {
      booking: {
        scheduledStart: 'asc'
      }
    }
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sitter Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
      {assignments.length === 0 ? (
        <p className="text-gray-700">You have no pending requests.</p>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment: any) => (
            <div key={assignment.id} className="border p-4 rounded shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">{assignment.booking.serviceType.name}</span>
                  <p className="text-sm text-gray-600 mt-1">Customer: {assignment.booking.customer.displayName}</p>
                  <p className="text-sm text-gray-600">Start: {new Date(assignment.booking.scheduledStart).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">End: {new Date(assignment.booking.scheduledEnd).toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700">Accept</button>
                  <button className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700">Decline</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
