/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — From Ink",
  description: "The terms governing your use of From Ink and your poster order.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" lastUpdated="June 22, 2026">
      <h2>1. Agreement to Terms</h2>
      <p>
        By accessing or using from.ink ("the Service"), you agree to be bound by these Terms &
        Conditions. If you do not agree, please do not use the Service. From Ink is operated from
        Trollhättan, Sweden. For questions about these terms, contact us at{" "}
        <a href="mailto:hello@from.ink">hello@from.ink</a>
      </p>

      <h2>2. The Service</h2>
      <p>
        From Ink allows you to upload a photo of a child's drawing, which is transformed into a
        watercolour-style illustration using AI image generation. You may preview the result before
        purchasing a printed poster. The poster is printed on demand by our fulfillment partner
        (Gelato) and shipped to your specified address. The Service is intended for adults only. By
        using the Service you confirm you are at least 18 years old.
      </p>

      <h2>3. Orders and Payment</h2>
      <ul>
        <li>
          All prices are displayed in Euros (€). The current price for a Classic Matte Poster
          (40×50cm) is €39, inclusive of shipping.
        </li>
        <li>Payment is processed securely by Stripe. We never see or store your card details.</li>
        <li>
          By completing a purchase you enter into a binding contract with From Ink for the delivery
          of a personalised printed poster.
        </li>
        <li>
          We reserve the right to cancel any order at our discretion, in which case a full refund
          will be issued promptly.
        </li>
      </ul>

      <h2>4. The Free Preview</h2>
      <p>
        Before any payment is taken, you are shown a watermarked preview of your AI-generated
        artwork. By proceeding to payment after viewing the preview, you confirm that you are
        satisfied with the result and wish to proceed with printing. The printed poster will
        faithfully reproduce the artwork shown in your approved preview. Minor variations in colour
        rendering between screen and print are normal and do not constitute a defect.
      </p>

      <h2>5. Personalised Items and Right of Withdrawal</h2>
      <p>
        Because every poster is custom-created from your specific drawing and approved by you before
        payment, your order is a personalised item and is exempt from the standard EU 14-day right
        of withdrawal under the Consumer Rights Directive (Article 16c). We are unable to accept
        returns or issue refunds simply because you have changed your mind after approving the
        preview and completing payment.
      </p>

      <h2>6. Refunds and Returns</h2>
      <p>
        We stand behind the quality of our product. We will issue a full refund or free reprint if
        your poster arrives damaged or physically defective, or if the printed poster looks
        significantly different from the preview you approved beyond normal colour variation.
      </p>
      <p>
        To request a refund or reprint, email{" "}
        <a href="mailto:hello@from.ink">hello@from.ink</a> within 14 days of delivery with a photo of
        the issue. You do not need to return the poster.
      </p>
      <p>
        We are unable to issue refunds for dissatisfaction with the AI result after the preview was
        approved, orders where production has already begun and no defect exists, or damage caused
        by improper handling after delivery.
      </p>

      <h2>7. Production and Shipping</h2>
      <ul>
        <li>
          Orders are sent to Gelato immediately after payment is confirmed. Production typically
          begins within hours of ordering.
        </li>
        <li>
          Cancellation after production has begun is not guaranteed but we will try our best if
          contacted immediately at <a href="mailto:hello@from.ink">hello@from.ink</a>
        </li>
        <li>
          Estimated delivery is 5–12 business days depending on your location. Delivery times are
          estimates and not guaranteed.
        </li>
        <li>Shipping is included in the price. No additional charges apply at checkout.</li>
      </ul>

      <h2>8. Your Content and Licence</h2>
      <p>
        By uploading a drawing to From Ink, you confirm that you own the drawing or have the right
        to use it, the drawing does not infringe any third-party intellectual property rights, and
        the drawing does not contain illegal, offensive, or inappropriate content.
      </p>
      <p>
        You grant From Ink a limited, non-exclusive licence to process and store your uploaded image
        solely for the purpose of generating your poster and fulfilling your order. We do not use
        your drawings for AI training, marketing, or any other purpose.
      </p>

      <h2>9. AI-Generated Content</h2>
      <p>
        The artwork produced by From Ink is generated using AI image generation technology. Results
        may vary and are not guaranteed to meet every expectation. The free preview exists
        specifically so you can evaluate the result before committing to a purchase. We are honest
        about the fact that AI generates the artwork and do not misrepresent the production process.
      </p>

      <h2>10. Intellectual Property</h2>
      <p>
        The From Ink name, logo, website design, and brand are our intellectual property. The
        AI-generated artwork created from your drawing is yours to use for personal, non-commercial
        purposes once your order is complete. We retain no rights to use it beyond fulfilling your
        order.
      </p>

      <h2>11. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by applicable law, From Ink is not liable for any indirect,
        incidental, or consequential damages arising from use of the Service. Our total liability
        for any claim arising from a specific order shall not exceed the amount paid for that order
        (€39). Nothing in these terms limits your statutory rights as a consumer under Swedish or EU
        law.
      </p>

      <h2>12. Governing Law</h2>
      <p>
        These Terms & Conditions are governed by the laws of Sweden. Any disputes shall be subject
        to the jurisdiction of Swedish courts. As a consumer in the EU, you may also use the
        European Commission's Online Dispute Resolution platform:{" "}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          ec.europa.eu/consumers/odr
        </a>
      </p>

      <h2>13. Changes to These Terms</h2>
      <p>
        We may update these Terms & Conditions from time to time. Significant changes will be
        reflected in the "Last updated" date at the top of this page. Continued use of the Service
        after changes constitutes acceptance of the updated terms.
      </p>

      <h2>14. Contact</h2>
      <p>
        Email: <a href="mailto:hello@from.ink">hello@from.ink</a>
        <br />
        Address: Göteborgsvägen, Trollhättan, Sweden
      </p>
    </LegalPage>
  );
}
