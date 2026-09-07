import React from "react";
import { Heading, Text, Button, Section } from "@react-email/components";
import BaseLayout from "./base-layout";

export interface WelcomeEmailProps {
  recipientName: string;
  userType: "customer" | "saathi";
  dashboardUrl: string;
}

export default function WelcomeEmail({
  recipientName,
  userType,
  dashboardUrl,
}: WelcomeEmailProps): React.ReactElement {
  const isCustomer = userType === "customer";

  return (
    <BaseLayout>
      <Heading as="h2" style={headingStyle}>
        {isCustomer
          ? `Welcome to PetSaathi, ${recipientName}! 🐾`
          : `Welcome to the PetSaathi Saathi Family, ${recipientName}! 🐾`}
      </Heading>

      <Text style={subheadingStyle}>
        {isCustomer
          ? "Your pet deserves the best care — and you just made that possible."
          : "You're now part of a trusted network of professional pet caregivers."}
      </Text>

      <Section style={stepsSectionStyle}>
        <Text style={stepHeadingStyle}>Here are your next steps:</Text>
        {isCustomer ? (
          <>
            <Text style={stepItemStyle}>1. 🐕 <strong>Add your pet&apos;s profile</strong> — breed, age, and medical history.</Text>
            <Text style={stepItemStyle}>2. 📍 <strong>Browse verified Saathi caregivers</strong> in your neighborhood.</Text>
            <Text style={stepItemStyle}>3. ✨ <strong>Book your first dog walk</strong> or sitting session.</Text>
          </>
        ) : (
          <>
            <Text style={stepItemStyle}>1. 🎓 <strong>Complete your Saathi Academy</strong> training modules.</Text>
            <Text style={stepItemStyle}>2. 🗓 <strong>Set your weekly availability</strong> and service zones.</Text>
            <Text style={stepItemStyle}>3. 🐾 <strong>Wait for your first assignment</strong> — it&apos;s coming soon!</Text>
          </>
        )}
      </Section>

      <Section style={buttonContainerStyle}>
        <Button href={dashboardUrl} style={buttonStyle}>
          {isCustomer ? "Go to My Dashboard" : "Go to My Saathi Portal"}
        </Button>
      </Section>
    </BaseLayout>
  );
}

const headingStyle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#1A1A2E",
  margin: "0 0 12px 0",
};

const subheadingStyle: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#495057",
  margin: "0 0 24px 0",
};

const stepsSectionStyle: React.CSSProperties = {
  backgroundColor: "#F8F9FA",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "16px 0 24px 0",
};

const stepHeadingStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#212529",
  margin: "0 0 12px 0",
};

const stepItemStyle: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#495057",
  margin: "6px 0",
};

const buttonContainerStyle: React.CSSProperties = {
  textAlign: "center",
  marginTop: "24px",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#FF6B2C",
  color: "#FFFFFF",
  padding: "14px 28px",
  borderRadius: "8px",
  fontWeight: "700",
  fontSize: "15px",
  textDecoration: "none",
  display: "inline-block",
};
