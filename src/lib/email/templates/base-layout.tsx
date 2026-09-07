import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface BaseLayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps): React.ReactElement {
  return (
    <Html lang="en">
      <Head />
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {/* Header Bar */}
          <Section style={headerStyle}>
            <Text style={logoTextStyle}>🐾 PetSaathi</Text>
          </Section>

          {/* Body Content */}
          <Section style={contentStyle}>
            {children}
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Hr style={dividerStyle} />
            <Text style={footerTextStyle}>
              © 2026 PetSaathi Technologies Pvt. Ltd. | Ahmedabad, India
            </Text>
            <Text style={footerSubTextStyle}>
              support@petsaathi.in • You received this because you have a PetSaathi account.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const mainStyle: React.CSSProperties = {
  backgroundColor: "#F8F9FA",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  margin: 0,
  padding: "24px 0",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #EAEAEA",
};

const headerStyle: React.CSSProperties = {
  backgroundColor: "#FF6B2C",
  padding: "20px 24px",
  textAlign: "center",
};

const logoTextStyle: React.CSSProperties = {
  color: "#FFFFFF",
  fontSize: "24px",
  fontWeight: "800",
  letterSpacing: "-0.5px",
  margin: 0,
};

const contentStyle: React.CSSProperties = {
  padding: "32px 24px",
  color: "#212529",
};

const dividerStyle: React.CSSProperties = {
  borderColor: "#EAEAEA",
  margin: "24px 0 16px 0",
};

const footerStyle: React.CSSProperties = {
  padding: "0 24px 24px 24px",
  textAlign: "center",
};

const footerTextStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#6C757D",
  margin: "4px 0",
};

const footerSubTextStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#ADB5BD",
  margin: "4px 0",
};
