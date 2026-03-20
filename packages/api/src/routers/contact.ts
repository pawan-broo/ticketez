import { z } from 'zod';
import { router, publicProcedure } from '../index';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const contactRouter = router({
  send: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Valid email is required'),
        subject: z.string().min(1, 'Subject is required'),
        message: z.string().min(10, 'Message must be at least 10 characters'),
      }),
    )
    .mutation(async ({ input }) => {
      const toEmail = process.env.GMAIL_USER;

      if (!toEmail) {
        throw new Error('Email service is not configured');
      }

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contact Form Submission</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; }
    .wrapper { width: 100%; background-color: #f5f5f5; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    .header { background-color: #1a1a2e; padding: 28px 40px; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; }
    .header p { margin: 4px 0 0; color: rgba(255,255,255,0.6); font-size: 13px; }
    .content { padding: 32px 40px; }
    .label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .value { font-size: 15px; color: #1a1a2e; margin-bottom: 20px; padding: 12px 16px; background-color: #f9fafb; border-radius: 6px; border-left: 3px solid #1a1a2e; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
    .reply-btn { display: inline-block; background-color: #1a1a2e; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 600; margin-top: 8px; }
    .footer { border-top: 1px solid #e5e7eb; padding: 20px 40px; text-align: center; }
    .footer p { margin: 0; color: #9ca3af; font-size: 12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>🎫 Ticketez</h1>
        <p>New contact form submission</p>
      </div>
      <div class="content">
        <p class="label">From</p>
        <div class="value">${input.name} &lt;${input.email}&gt;</div>

        <p class="label">Subject</p>
        <div class="value">${input.subject}</div>

        <p class="label">Message</p>
        <div class="value">${input.message}</div>

        <a href="mailto:${input.email}?subject=Re: ${encodeURIComponent(input.subject)}" class="reply-btn">
          Reply to ${input.name}
        </a>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Ticketez. This message was sent via the contact form.</p>
      </div>
    </div>
  </div>
</body>
</html>
      `;

      try {
        await transporter.sendMail({
          from: `Ticketez Contact Form <${toEmail}>`,
          to: toEmail,
          replyTo: `${input.name} <${input.email}>`,
          subject: `[Contact] ${input.subject} — from ${input.name}`,
          html,
        });

        return { success: true };
      } catch (error) {
        console.error('[Contact] Failed to send email:', error);
        throw new Error('Failed to send message. Please try again later.');
      }
    }),
});
