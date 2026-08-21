import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function approveEmployee(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user || user.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  const sitterId = formData.get("sitterId") as string;
  await prisma.sitterProfile.update({
    where: { id: sitterId },
    data: { status: "APPROVED", approvedAt: new Date() }
  });
  
  // Trigger Employee Email Notification: "Your account has been approved!"
  console.log(`[EMAIL to Employee] Your employee request has been approved!`);
  revalidatePath("/admin/saathis");
}

async function rejectEmployee(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user || user.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  const sitterId = formData.get("sitterId") as string;
  await prisma.sitterProfile.update({
    where: { id: sitterId },
    data: { status: "REJECTED" }
  });
  
  // Trigger Employee Email Notification: "Your account has been rejected."
  console.log(`[EMAIL to Employee] Your employee request was not approved.`);
  revalidatePath("/admin/saathis");
}

export default async function SaathisAdminPage() { 
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  const pendingRequests = await prisma.sitterProfile.findMany({
    where: { status: "APPLICANT" },
    include: { user: true },
    orderBy: { applicationAt: 'asc' }
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Employee Access Requests</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Pending Requests: {pendingRequests.length}</h2>
        </div>
        
        <div className="divide-y">
          {pendingRequests.map((req: any) => (
            <div key={req.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <p className="font-semibold text-lg">{req.user.displayName}</p>
                <p className="text-gray-600">{req.user.email}</p>
                <p className="text-sm text-gray-700 mt-1">Requested: {req.applicationAt.toLocaleString()}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">PENDING</span>
              </div>
              
              <div className="flex gap-3 mt-4 md:mt-0">
                <form action={approveEmployee}>
                  <input type="hidden" name="sitterId" value={req.id} />
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition">APPROVE</button>
                </form>
                <form action={rejectEmployee}>
                  <input type="hidden" name="sitterId" value={req.id} />
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition">REJECT</button>
                </form>
              </div>
            </div>
          ))}
          {pendingRequests.length === 0 && (
            <div className="p-6 text-gray-700">No pending employee requests.</div>
          )}
        </div>
      </div>
    </div>
  ); 
}
