import React from "react";
import { Heading, Text, Button, Section, Hr } from "@react-email/components";
import BaseLayout from "./base-layout";

export interface BookingConfirmationEmailProps {
  customerName: string;
  petName: string;
  serviceName: string;
  bookingId: string;
  bookingDate: string;
  bookingTime: string;
  saathiName?: string;
  amount: string;
  dashboardUrl: string;
}

export default function BookingConfirmationEmail({
  customerName,
  petName,
  serviceName,
  bookingId,
  bookingDate,
  bookingTime,
  saathiName,
  amount,
  dashboardUrl,
}: BookingConfirmationEmailProps): React.ReactElement {
  return (
    <BaseLayout>
      <Heading as="h2" style={headingStyle}>
        Booking Confirmed! ✅
      </Heading>

      <Text style={paragraphStyle}>
        Hi {customerName}, your care booking for <strong>{petName}</strong> is all set!
      </Text>

      <Section style={cardStyle}>
        <Text style={detailRowStyle}>
          <span style={labelStyle}>Booking ID:</span> <strong>{bookingId}</strong>
        </Text>
        <Text style={detailRowStyle}>
          <span style={labelStyle}>Service:</span> {serviceName}
        </Text>
        <Text style={detailRowStyle}>
          <span style={labelStyle}>Pet:</span> {petName}
        </Text>
        <Text style={detailRowStyle}>
          <span style={labelStyle}>Date:</span> {bookingDate}
        </Text>
        <Text style={detailRowStyle}>
          <span style={labelStyle}>Time Slot:</span> {bookingTime}
        </Text>
        <Text style={detailRowStyle}>
          <span style={labelStyle}>Caregiver:</span> {saathiName || "Being Assigned Shortly"}
        </Text>
        <Hr style={hrStyle} />
        <Text style={detailRowStyle}>
          <span style={labelStyle}>Total Paid:</span> <strong style={priceStyle}>{amount}</strong>
        </Text>
      </Section>

      <Text style={noteStyle}>
        💡 <em>You can track your service live and message your caregiver directly in the PetSaathi app once the session begins.</em>
      </Text>

      <Section style={buttonContainerStyle}>
        <Button href={dashboardUrl} style={buttonStyle}>
          View Booking Details
        </Button>
      </Section>
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
  margin: "0 0 16px 0",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#F8F9FA",
  borderRadius: "10px",
  padding: "18px 20px",
  border: "1px solid #EAEAEA",
  margin: "20px 0",
};

const detailRowStyle: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#343A40",
  margin: "6px 0",
};

const labelStyle: React.CSSProperties = {
  color: "#6C757D",
  display: "inline-block",
  minWidth: "110px",
};

const priceStyle: React.CSSProperties = {
  color: "#2B8A3E",
  fontSize: "16px",
};

const hrStyle: React.CSSProperties = {
  borderColor: "#DEE2E6",
  margin: "12px 0",
};

const noteStyle: React.CSSProperties = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#495057",
  margin: "16px 0",
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
