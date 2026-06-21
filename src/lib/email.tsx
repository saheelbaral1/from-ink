import { Resend } from "resend";
import { render } from "@react-email/components";
import OrderConfirmation, { type OrderConfirmationProps } from "@/emails/OrderConfirmation";

// mail.from.ink is a verified Resend domain (eu-west-1), so we can send from it
// to any recipient. Overridable via env if the address ever changes.
const FROM = process.env.EMAIL_FROM ?? "From.ink <orders@mail.from.ink>";
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "orders@mail.from.ink";

export async function renderOrderConfirmation(props: OrderConfirmationProps) {
  return render(<OrderConfirmation {...props} />);
}

export async function sendOrderConfirmation(to: string, props: OrderConfirmationProps) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

  const resend = new Resend(apiKey);
  const html = await renderOrderConfirmation(props);

  return resend.emails.send({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: "Your keepsake is on its way",
    html,
  });
}
