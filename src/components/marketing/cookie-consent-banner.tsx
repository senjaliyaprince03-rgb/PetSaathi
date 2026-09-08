"use client";

import { useEffect, useState } from "react";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import { GoogleAnalytics } from "@next/third-parties/google";
import { hasUsableAnalyticsId } from "@/lib/public-config";

export function CookieConsentBanner({ analyticsId }: { analyticsId?: string }) {
  const [isClient, setIsClient] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (getCookieConsentValue("petsaathi-cookie-consent") === "true") {
      setHasConsented(true);
    }
  }, []);

  if (!isClient) return null;

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Accept All"
        ariaAcceptLabel="Accept All"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName="petsaathi-cookie-consent"
        style={{ background: "#301F30", alignItems: "center", padding: "12px 24px" }}
        buttonStyle={{ background: "#D4AF37", color: "#301F30", fontSize: "14px", borderRadius: "9999px", fontWeight: "bold", padding: "10px 20px" }}
        declineButtonStyle={{ background: "transparent", color: "#fff", fontSize: "14px", borderRadius: "9999px", padding: "10px 20px", border: "1px solid #fff" }}
        expires={150}
        onAccept={() => {
          setHasConsented(true);
          // Trigger analytics if accepted
          if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("consent", "update", {
              analytics_storage: "granted",
            });
          }
        }}
        onDecline={() => {
          setHasConsented(false);
          if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("consent", "update", {
              analytics_storage: "denied",
            });
          }
        }}
      >
        <span className="text-sm font-medium text-white/90">
          We use cookies to improve your experience and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
          Read our <a href="/privacy" className="underline hover:text-[#D4AF37]">Privacy Policy</a> for more details.
        </span>
      </CookieConsent>
      {hasConsented && hasUsableAnalyticsId(analyticsId) && (
        <GoogleAnalytics gaId={analyticsId!} />
      )}
    </>
  );
}
