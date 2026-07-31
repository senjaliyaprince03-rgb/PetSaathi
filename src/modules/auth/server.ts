import { getCurrentIdentity } from "./session";

export async function getAdminSession(): Promise<string> {
  const identity = await getCurrentIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }
  
  // Basic check for admin role
  const isAdmin = identity.roles.some(role => 
    ["OPERATIONS_ADMIN", "VERIFICATION_ADMIN", "SAFETY_ADMIN", "FINANCE_ADMIN", "CONTENT_ADMIN", "SUPER_ADMIN", "CITY_MANAGER"].includes(role)
  );

  if (!isAdmin) {
    throw new Error("Forbidden");
  }

  return identity.id;
}
