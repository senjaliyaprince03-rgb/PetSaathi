import React from "react";
import { Heading, Text, Section } from "@react-email/components";
import BaseLayout from "./base-layout";

export interface OtpVerificationEmailProps {
  otp: string; // 6 digits
  recipientName?: string;
  purpose: "registration" | "login" | "password-reset" | "email-change";
  expiryMinutes: number;
}

const titles: Record<OtpVerificationEmailProps["purpose"], string> = {
  registration: "Verify Your PetSaathi Account",
  login: "Your PetSaathi Login Code",
  "password-reset": "Reset Your PetSaathi Password",
  "email-change": "Confirm Your New Email Address",
};

export default function OtpVerificationEmail({
  otp,
  recipientName,
  purpose,
  expiryMinutes,
}: OtpVerificationEmailProps): React.ReactElement {
  const greeting = recipientName ? `Hi ${recipientName}!` : "Hi there!";
  const heading = titles[purpose] ?? "Your Verification Code";

  return (
    <BaseLayout>
      <Heading as="h2" style={headingStyle}>
        {heading}
      </Heading>
      <Text style={paragraphStyle}>{greeting}</Text>
      <Text style={paragraphStyle}>
        Please use the following single-use verification code to proceed:
      </Text>

      {/* Prominent OTP Code Box */}
      <Section style={otpBoxStyle}>
        <Text style={otpTextStyle}>{otp.split("").join(" ")}</Text>
      </Section>

      {/* Expiry Warning */}
      <Text style={warningStyle}>
        ⏱ This code expires in {expiryMinutes} minutes.
      </Text>

      {/* Security Notes */}
      <Text style={securityStyle}>
        Never share this code with anyone, including PetSaathi team members or caregivers.
      </Text>
      <Text style={mutedStyle}>
        If you did not request this code, your account is safe and you can safely ignore this email.
      </Text>
    </BaseLayout>
  );
}

const headingStyle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#1A1A2E",
  margin: "0 0 16px 0",
};

const paragraphStyle: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#212529",
  margin: "0 0 12px 0",
};

const otpBoxStyle: React.CSSProperties = {
  backgroundColor: "#FFF3EE",
  border: "1px dashed #FF6B2C",
  borderRadius: "10px",
  padding: "16px 20px",
  margin: "24px 0",
  textAlign: "center",
};

const otpTextStyle: React.CSSProperties = {
  fontSize: "36px",
  fontWeight: "800",
  color: "#FF6B2C",
  letterSpacing: "8px",
  margin: 0,
};

const warningStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#E63946",
  textAlign: "center",
  margin: "12px 0",
};

const securityStyle: React.CSSProperties = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#495057",
  marginTop: "20px",
};

const mutedStyle: React.CSSProperties = {
  fontSize: "12px",
  lineHeight: "18px",
  color: "#6C757D",
  marginTop: "8px",
};
