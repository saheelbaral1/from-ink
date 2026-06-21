import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

// Email clients won't load custom webfonts reliably — use safe fallbacks that
// echo the brand stacks (Cormorant→serif, Inter→sans).
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

// Brand palette (hex; rgba where we need low-opacity borders).
const PAPER = "#F7F4EE";
const INK = "#1C1C1C";
const NAVY = "#48546A";
const SAGE = "#7B8B78";
const MOUNT_SHADE = "#EAE4D8"; // a hair darker than paper, to fake depth around the print

export interface OrderConfirmationProps {
  imageUrl: string;
  productName: string;
  price: string;
  deliveryEstimate: string;
}

export default function OrderConfirmation({
  imageUrl,
  productName,
  price,
  deliveryEstimate,
}: OrderConfirmationProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Your keepsake is on its way.</Preview>
      <Body style={{ margin: 0, padding: 0, backgroundColor: PAPER, fontFamily: SANS }}>
        <Container style={{ width: "100%", maxWidth: "600px", margin: "0 auto", padding: "32px 24px" }}>
          {/* 1. Header wordmark */}
          <Section style={{ textAlign: "center", paddingBottom: "20px" }}>
            <Text
              style={{
                margin: 0,
                fontFamily: SERIF,
                fontSize: "20px",
                letterSpacing: "0.5px",
                color: INK,
              }}
            >
              From
              <span style={{ fontStyle: "italic", color: "rgba(28,28,28,0.6)" }}>.ink</span>
            </Text>
          </Section>

          {/* 2. Hero image in a white "mount" on a slightly darker shade (faked depth) */}
          <Section style={{ padding: "4px 0 8px" }}>
            <div
              style={{
                maxWidth: "480px",
                margin: "0 auto",
                backgroundColor: MOUNT_SHADE,
                padding: "14px",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: "16px",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "6px",
                }}
              >
                <Img
                  src={imageUrl}
                  alt="Your watercolour keepsake"
                  width="440"
                  style={{
                    width: "100%",
                    maxWidth: "440px",
                    height: "auto",
                    display: "block",
                    margin: "0 auto",
                    borderRadius: "3px",
                  }}
                />
              </div>
            </div>
          </Section>

          {/* 3. Headline */}
          <Heading
            as="h1"
            style={{
              fontFamily: SERIF,
              fontSize: "28px",
              lineHeight: "1.25",
              fontWeight: 400,
              color: INK,
              textAlign: "center",
              margin: "32px 0 0",
            }}
          >
            Your keepsake is on its way.
          </Heading>

          {/* 4. Paragraph */}
          <Text
            style={{
              fontFamily: SANS,
              fontSize: "15px",
              lineHeight: "1.65",
              color: NAVY,
              textAlign: "center",
              maxWidth: "480px",
              margin: "16px auto 0",
            }}
          >
            Thank you for trusting us with this moment. Your drawing is being carefully printed and
            prepared to ship.
          </Text>

          {/* 5. Order details card */}
          <Section style={{ padding: "28px 0 0" }}>
            <div
              style={{
                maxWidth: "360px",
                margin: "0 auto",
                backgroundColor: PAPER,
                border: "1px solid rgba(72,84,106,0.28)",
                borderRadius: "8px",
                padding: "18px 20px",
              }}
            >
              <Text
                style={{
                  fontFamily: SANS,
                  fontSize: "14px",
                  fontWeight: 600,
                  color: INK,
                  textAlign: "center",
                  margin: "0 0 6px",
                }}
              >
                {productName}
              </Text>
              <Text
                style={{
                  fontFamily: SANS,
                  fontSize: "14px",
                  color: INK,
                  textAlign: "center",
                  margin: "0 0 6px",
                }}
              >
                {price}
              </Text>
              <Text
                style={{
                  fontFamily: SANS,
                  fontSize: "13px",
                  color: NAVY,
                  textAlign: "center",
                  margin: 0,
                }}
              >
                {deliveryEstimate}
              </Text>
            </div>
          </Section>

          {/* 6. Closing line */}
          <Text
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "16px",
              color: SAGE,
              textAlign: "center",
              margin: "32px 0 0",
            }}
          >
            Made with care, one drawing at a time.
          </Text>

          {/* 7. Footer */}
          <Hr style={{ borderColor: "rgba(28,28,28,0.08)", margin: "32px 0 16px" }} />
          <Text
            style={{
              fontFamily: SANS,
              fontSize: "12px",
              color: "rgba(28,28,28,0.45)",
              textAlign: "center",
              margin: 0,
            }}
          >
            From Ink
          </Text>
          <Text
            style={{
              fontFamily: SANS,
              fontSize: "12px",
              color: "rgba(28,28,28,0.45)",
              textAlign: "center",
              margin: "4px 0 0",
            }}
          >
            Questions? Just reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
