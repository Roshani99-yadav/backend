import nodemailer from "nodemailer";

/**
 * Singleton Nodemailer transporter built once from env vars and reused
 * across every request (creating a new transporter per-request is wasteful
 * and can exhaust SMTP connection limits).
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends an email through the shared transporter.
 * @param {Object} params
 * @param {string} params.to - Recipient address.
 * @param {string} params.subject - Email subject line.
 * @param {string} params.html - HTML body.
 * @param {string} [params.replyTo] - Optional reply-to address (customer's email).
 */
export async function sendMail({ to, subject, html, replyTo }) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  };

  if (replyTo) {
    mailOptions.replyTo = replyTo;
  }

  const info = await transporter.sendMail(mailOptions);

  // Ethereal (and only Ethereal) returns a hosted preview URL for the sent
  // email since it never delivers to a real inbox — surface it for local dev.
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`Preview email: ${previewUrl}`);
  }

  return info;
}

export default transporter;
