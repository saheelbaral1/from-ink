/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — From Ink",
  description: "How From Ink collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="June 22, 2026">
      <h2>1. Who We Are</h2>
      <p>
        From Ink ("we," "us," or "our") operates the website from.ink. We are based in Trollhättan,
        Sweden, and are subject to the General Data Protection Regulation (GDPR).
      </p>
      <p>
        For privacy-related questions, contact us at:{" "}
        <a href="mailto:hello@from.ink">hello@from.ink</a>
      </p>

      <h2>2. What We Do</h2>
      <p>
        From Ink is an online service that transforms children's drawings into watercolour-style
        poster prints. Users upload a photo of a drawing, which is processed using AI image
        generation to create a styled illustration. The resulting artwork is previewed by the
        customer before purchase, then printed on demand and shipped as a physical poster. In
        providing this service, we collect and process personal information including email
        addresses, uploaded images, and shipping details.
      </p>

      <h2>3. Information We Collect</h2>
      <p>Information you provide directly:</p>
      <ul>
        <li>Email address (entered during checkout)</li>
        <li>Shipping address (entered during payment)</li>
        <li>Billing address (entered during payment)</li>
        <li>Uploaded drawing images (submitted for AI transformation)</li>
      </ul>
      <p>Information collected automatically:</p>
      <ul>
        <li>Log and usage data (IP address, browser type, pages visited, timestamps)</li>
        <li>Device data (device type, operating system, hardware model)</li>
        <li>Location data (approximate location derived from IP address)</li>
      </ul>
      <p>
        We do not collect names, phone numbers, passwords, usernames, or any account registration
        data. We do not operate user accounts.
      </p>

      <h2>4. How We Use Your Information</h2>
      <p>Performance of a contract:</p>
      <ul>
        <li>To process your order and payment via Stripe</li>
        <li>To generate your personalised poster using AI</li>
        <li>To send your order to our print partner (Gelato) for fulfillment and shipping</li>
        <li>To send you an order confirmation email via Resend</li>
      </ul>
      <p>Legitimate interests:</p>
      <ul>
        <li>To deliver targeted advertising (via Meta pixel, with your consent)</li>
        <li>To measure the effectiveness of our advertising campaigns</li>
        <li>To identify usage trends and improve our service</li>
        <li>To protect our services against fraud and misuse</li>
      </ul>
      <p>Legal obligation:</p>
      <ul>
        <li>To retain transaction records as required by Swedish accounting law (7 years)</li>
      </ul>
      <p>Consent:</p>
      <ul>
        <li>
          To place non-essential cookies and tracking technologies (you may withdraw consent at any
          time via the Consent Preferences link in our footer)
        </li>
      </ul>

      <h2>5. Third Parties We Share Data With</h2>
      <p>
        To operate our service, we share your data with the following third-party processors:
      </p>
      <ul>
        <li>Stripe — Payment processing (USA/EU)</li>
        <li>Gelato — Print-on-demand fulfillment and shipping (Global)</li>
        <li>Google (Gemini) — AI image generation (USA)</li>
        <li>Supabase — Image storage and email capture (EU)</li>
        <li>Resend — Transactional email delivery (USA)</li>
        <li>Vercel — Website hosting and infrastructure (USA/EU)</li>
        <li>Meta — Advertising and analytics, with consent (USA)</li>
      </ul>
      <p>
        All third-party processors are bound by data processing agreements and comply with GDPR
        through Standard Contractual Clauses or equivalent mechanisms. We do not sell your personal
        data.
      </p>

      <h2>6. Cookies and Tracking Technologies</h2>
      <p>
        We use cookies and similar tracking technologies on our website. Non-essential cookies
        (including the Meta advertising pixel) are only placed after you provide explicit consent
        via our cookie consent banner. You can change your cookie preferences at any time using the
        Consent Preferences link in the footer of our website.
      </p>

      <h2>7. Data Retention</h2>
      <ul>
        <li>
          Transaction records (email, order details, shipping address): 7 years, as required by
          Swedish accounting law
        </li>
        <li>Generated images stored in Supabase: 3 years from the date of generation</li>
        <li>
          Email addresses captured prior to purchase (where no order was completed): 12 months
        </li>
        <li>Server logs: 90 days</li>
      </ul>
      <p>After these periods, data is deleted or anonymised.</p>

      <h2>8. Your Rights Under GDPR</h2>
      <p>If you are located in the EU, UK, or EEA, you have the following rights:</p>
      <ul>
        <li>Right of access — request a copy of the data we hold about you</li>
        <li>Right to rectification — request correction of inaccurate data</li>
        <li>Right to erasure — request deletion of your data</li>
        <li>Right to restriction — request that we limit how we use your data</li>
        <li>Right to data portability — request your data in a machine-readable format</li>
        <li>Right to object — object to processing based on legitimate interests</li>
        <li>Right to withdraw consent — withdraw cookie consent at any time</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at{" "}
        <a href="mailto:hello@from.ink">hello@from.ink</a>. We will respond within 30 days. You also
        have the right to lodge a complaint with the Swedish data protection authority,
        Integritetsskyddsmyndigheten (IMY):{" "}
        <a href="https://imy.se" target="_blank" rel="noopener noreferrer">
          imy.se
        </a>
      </p>

      <h2>9. Your Rights Under CCPA (California Residents)</h2>
      <p>
        If you are a California resident, you have the right to know what personal information we
        collect, request deletion, opt out of the sale of your personal information (we do not sell
        personal information), and non-discrimination for exercising your privacy rights. Contact us
        at <a href="mailto:hello@from.ink">hello@from.ink</a> to exercise these rights.
      </p>

      <h2>10. Children's Privacy</h2>
      <p>
        Our service is directed at adults. We do not knowingly collect personal information from
        anyone under the age of 18. Children may be the subject of uploaded drawings, but the
        service is operated by and for adults only. If you believe we have inadvertently collected
        data relating to a minor, please contact us at{" "}
        <a href="mailto:hello@from.ink">hello@from.ink</a> and we will delete it promptly.
      </p>

      <h2>11. Data Security</h2>
      <p>
        We take reasonable technical and organisational measures to protect your personal data,
        including encrypted data transmission (HTTPS), access controls on our database, and secure
        payment processing via Stripe. In the event of a data breach that poses a risk to your
        rights and freedoms, we will notify the relevant supervisory authority within 72 hours and
        affected users without undue delay.
      </p>

      <h2>12. International Data Transfers</h2>
      <p>
        Some of our third-party processors are located outside the EU/EEA. Where this is the case,
        we ensure appropriate safeguards are in place, including Standard Contractual Clauses
        approved by the European Commission.
      </p>

      <h2>13. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of significant
        changes by updating the "Last updated" date at the top of this page.
      </p>

      <h2>14. Contact Us</h2>
      <p>
        Email: <a href="mailto:hello@from.ink">hello@from.ink</a>
        <br />
        Address: Göteborgsvägen, Trollhättan, Sweden
      </p>
    </LegalPage>
  );
}
