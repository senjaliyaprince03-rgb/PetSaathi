import { notFound } from "next/navigation";
import { getProgrammeBySlug } from "@/modules/b2b/programmes";
import { Building, ShieldCheck, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CompanyBenefitProgrammePage({
  params,
}: {
  params: { slug: string };
}) {
  let programme;
  try {
    programme = await getProgrammeBySlug(params.slug);
  } catch (err) {
    notFound();
  }

  if (programme.status !== "ACTIVE_PROGRAMME") {
    notFound();
  }

  return (
    <div className="container-shell mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full mb-6">
          <Building className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {programme.organization.displayName} Pet Care Benefits
        </h1>
        <p className="text-xl text-gray-600">
          Powered by PetSaathi
        </p>
      </div>

      <div className="bg-paper shadow-lg rounded-2xl p-8 mb-8 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-green-500" /> Programme Overview
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Programme Name</h3>
              <p className="text-gray-600">{programme.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Benefit Type</h3>
              <p className="text-gray-600">{programme.programmeType.replace(/_/g, " ")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Eligibility Method</h3>
              <p className="text-gray-600">{programme.eligibilityMethod.replace(/_/g, " ")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Verify Your Employment</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          To access these benefits, you must verify your employment with {programme.organization.displayName}. 
          {programme.eligibilityMethod === "EMAIL_DOMAIN" && " Please use your corporate email address to verify."}
          {programme.eligibilityMethod === "SSO" && " You can verify by logging in through your company's SSO portal."}
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Verify Eligibility
        </button>
      </div>
    </div>
  );
}
