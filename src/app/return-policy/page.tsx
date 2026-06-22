/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Return Policy — From Ink",
  description: "Returns, refunds, and reprints for your From Ink poster.",
};

export default function ReturnPolicyPage() {
  return (
    <LegalPage title="Return Policy" lastUpdated="June 22, 2026">
      <h2>Returns</h2>
      <p>
        As every poster is custom-created from your child's unique drawing and approved by you via a
        free preview before any payment is taken, personalised items are exempt from the standard EU
        14-day right of withdrawal under the Consumer Rights Directive (Article 16c). We are unable
        to accept returns simply because you changed your mind after approving the preview.
      </p>

      <h2>Refunds</h2>
      <p>
        We will issue a full refund or free reprint if your poster arrives damaged or physically
        defective, or if the printed poster looks significantly different from the preview you
        approved.
      </p>
      <p>
        To request a refund, email <a href="mailto:hello@from.ink">hello@from.ink</a> within 14 days
        of delivery with a photo of the issue. You do not need to return the poster — we will
        arrange a reprint or full refund without requiring you to ship anything back.
      </p>

      <h2>Items That Cannot Be Returned</h2>
      <ul>
        <li>
          Custom personalised posters where the AI-generated preview was approved before purchase
        </li>
        <li>Items where production has already begun</li>
        <li>Digital downloads</li>
        <li>Items damaged due to improper handling after delivery</li>
      </ul>

      <h2>Cancellations</h2>
      <p>
        Due to the personalised nature of each order, we cannot guarantee cancellation once
        production has begun (typically within hours of ordering). Contact us immediately at{" "}
        <a href="mailto:hello@from.ink">hello@from.ink</a> and we will do our best to help.
      </p>

      <h2>Shipping</h2>
      <p>
        Return shipping is covered by From Ink for eligible claims — however in practice, a photo of
        the issue is all we require. We will never ask you to ship the poster back.
      </p>

      <h2>Contact</h2>
      <p>
        Email: <a href="mailto:hello@from.ink">hello@from.ink</a>
        <br />
        Address: Göteborgsvägen, Trollhättan, Sweden
      </p>
    </LegalPage>
  );
}
