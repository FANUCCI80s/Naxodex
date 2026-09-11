
import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailOptions): Promise<void> {
  const fromEmail = process.env.EMAIL_FROM;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpSecure = process.env.SMTP_SECURE;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!fromEmail) {
    throw new Error("EMAIL_FROM is not configured.");
  }

  if (!smtpHost) {
    throw new Error("SMTP_HOST is not configured.");
  }

  if (!smtpPort) {
    throw new Error("SMTP_PORT is not configured.");
  }

  if (!smtpUser) {
    throw new Error("SMTP_USER is not configured.");
  }

  if (!smtpPassword) {
    throw new Error("SMTP_PASSWORD is not configured.");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: smtpSecure === "true",
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  await transporter.sendMail({
    from: fromEmail,
    to,
    subject,
    html,
    text,
  });
}