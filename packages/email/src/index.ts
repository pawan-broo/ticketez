import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface Member {
  name: string;
  age: number;
  email: string;
}

interface BookingEmailParams {
  to: string[];
  bookingId: string;
  placeName: string;
  placeLocation: string;
  bookingDate: Date;
  visitDate?: Date | null;
  totalMembers: number;
  totalAmount: number; // in paise
  transactionId: string;
  members: Member[];
  confirmationUrl: string;
}

const fromName = process.env.EMAIL_FROM_NAME || 'Ticketez';
const fromEmail = process.env.GMAIL_USER || 'noreply@ticketez.com';
const fromAddress = `${fromName} <${fromEmail}>`;

const formatAmount = (paise: number) => `₹${(paise / 100).toFixed(0)}`;

const baseStyles = `
  body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; }
  .wrapper { width: 100%; background-color: #f5f5f5; padding: 40px 20px; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
  .header { background-color: #1a1a2e; padding: 32px 40px; }
  .header h1 { margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
  .header p { margin: 6px 0 0; color: rgba(255,255,255,0.7); font-size: 14px; }
  .badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; }
  .badge-pending { background-color: #fef3c7; color: #92400e; }
  .badge-confirmed { background-color: #d1fae5; color: #065f46; }
  .content { padding: 32px 40px; }
  .place-name { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0 0 4px; }
  .place-location { font-size: 14px; color: #6b7280; margin: 0 0 24px; }
  .message-box { padding: 16px 20px; border-radius: 6px; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
  .message-box-pending { background-color: #fffbeb; border-left: 4px solid #f59e0b; color: #78350f; }
  .message-box-confirmed { background-color: #ecfdf5; border-left: 4px solid #10b981; color: #064e3b; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 14px; font-weight: 600; color: #374151; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.05em; }
  .info-table { width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; }
  .info-table td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #e5e7eb; }
  .info-table tr:last-child td { border-bottom: none; }
  .info-table .label { color: #6b7280; width: 40%; }
  .info-table .value { color: #1a1a2e; font-weight: 500; }
  .member-card { padding: 12px 16px; background-color: #f9fafb; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #1a1a2e; }
  .member-name { font-size: 14px; font-weight: 600; color: #1a1a2e; margin: 0 0 2px; }
  .member-detail { font-size: 13px; color: #6b7280; margin: 0; }
  .qr-section { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 28px; text-align: center; margin-bottom: 24px; }
  .qr-section h3 { margin: 0 0 8px; color: #1a1a2e; font-size: 16px; font-weight: 600; }
  .qr-section p { margin: 0 0 20px; color: #6b7280; font-size: 13px; }
  .qr-img { background-color: #ffffff; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb; display: inline-block; }
  .qr-status { margin-top: 16px; font-size: 12px; color: #9ca3af; }
  .cta-btn { display: inline-block; background-color: #1a1a2e; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 6px; font-size: 14px; font-weight: 600; }
  .notes { padding: 14px 16px; background-color: #f9fafb; border-radius: 6px; font-size: 13px; color: #4b5563; line-height: 1.7; margin-bottom: 24px; }
  .footer { border-top: 1px solid #e5e7eb; padding: 24px 40px; text-align: center; }
  .footer p { margin: 0 0 8px; color: #9ca3af; font-size: 12px; }
  .footer a { color: #1a1a2e; text-decoration: none; font-weight: 500; }
`;

const generatePendingTemplate = ({
  bookingId,
  placeName,
  placeLocation,
  bookingDate,
  visitDate,
  totalMembers,
  totalAmount,
  transactionId,
  members,
  confirmationUrl,
}: Omit<BookingEmailParams, 'to'>) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Received – ${placeName}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>🎫 Ticketez</h1>
        <p>Your Journey Awaits</p>
      </div>
      <div class="content">
        <div style="margin-bottom: 20px;">
          <span class="badge badge-pending">⏳ Payment Verification Pending</span>
        </div>
        <p class="place-name">${placeName}</p>
        <p class="place-location">📍 ${placeLocation}</p>

        <div class="message-box message-box-pending">
          <strong>We've received your booking request.</strong><br />
          We are currently verifying your payment. You will receive a confirmation email within <strong>1 hour</strong>.
          Please keep your transaction ID safe for reference.
        </div>

        <div class="section">
          <p class="section-title">Booking Details</p>
          <table class="info-table">
            <tr>
              <td class="label">Booking ID</td>
              <td class="value" style="font-family: monospace;">${bookingId.substring(0, 8).toUpperCase()}…</td>
            </tr>
            <tr>
              <td class="label">Booking Date</td>
              <td class="value">${bookingDate.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
            </tr>
            ${visitDate ? `
            <tr>
              <td class="label">Visit Date</td>
              <td class="value">📅 ${visitDate.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
            </tr>` : ''}
            <tr>
              <td class="label">Total Members</td>
              <td class="value">${totalMembers} ${totalMembers === 1 ? 'Person' : 'People'}</td>
            </tr>
            <tr>
              <td class="label">Amount Paid</td>
              <td class="value" style="font-weight: 700; color: #1a1a2e;">${formatAmount(totalAmount)}</td>
            </tr>
            <tr>
              <td class="label">Transaction ID</td>
              <td class="value" style="font-family: monospace; color: #6b7280;">${transactionId}</td>
            </tr>
            <tr>
              <td class="label">Status</td>
              <td class="value"><span style="color: #d97706; font-weight: 600;">Pending Verification</span></td>
            </tr>
          </table>
        </div>

        <div class="section">
          <p class="section-title">Visitor Details (${totalMembers} ${totalMembers === 1 ? 'Ticket' : 'Tickets'})</p>
          ${members.map(m => `
          <div class="member-card">
            <p class="member-name">${m.name}</p>
            <p class="member-detail">Age: ${m.age} &nbsp;·&nbsp; ${m.email}</p>
          </div>`).join('')}
        </div>

        <div class="qr-section">
          <h3>🎟️ Your Ticket (Preview)</h3>
          <p>Scan to check your booking status. Full ticket unlocks after payment is verified.</p>
          <div class="qr-img">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(confirmationUrl)}" alt="Ticket QR Code" width="180" height="180" />
          </div>
          <p class="qr-status">Status: <strong style="color: #d97706;">Pending Verification</strong></p>
          <div style="margin-top: 20px;">
            <a href="${confirmationUrl}" class="cta-btn">View Booking Status</a>
          </div>
        </div>

        <div class="notes">
          <strong>📌 What happens next?</strong><br />
          1. We will cross-verify your UPI transaction ID with our payment records.<br />
          2. Once verified, you'll receive a <strong>booking confirmation email</strong> with your final ticket.<br />
          3. This usually takes <strong>up to 1 hour</strong> during business hours.<br />
          4. If there's a mismatch, we'll reach out to you via email.
        </div>

        <div style="text-align: center;">
          <a href="${confirmationUrl}" class="cta-btn">View Booking Status</a>
        </div>
      </div>
      <div class="footer">
        <p>Questions? <a href="mailto:${fromEmail}">Contact Support</a></p>
        <p>© ${new Date().getFullYear()} Ticketez. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const generateConfirmedTemplate = ({
  bookingId,
  placeName,
  placeLocation,
  bookingDate,
  visitDate,
  totalMembers,
  totalAmount,
  transactionId,
  members,
  confirmationUrl,
}: Omit<BookingEmailParams, 'to'>) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmed – ${placeName}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>🎫 Ticketez</h1>
        <p>Your Journey Awaits</p>
      </div>
      <div class="content">
        <div style="margin-bottom: 20px;">
          <span class="badge badge-confirmed">✅ Booking Confirmed</span>
        </div>
        <p class="place-name">${placeName}</p>
        <p class="place-location">📍 ${placeLocation}</p>

        <div class="message-box message-box-confirmed">
          <strong>Your booking has been confirmed!</strong><br />
          Your payment has been successfully verified. Show the QR code below at the entry gate to enjoy your visit.
        </div>

        <div class="section">
          <p class="section-title">Booking Details</p>
          <table class="info-table">
            <tr>
              <td class="label">Booking ID</td>
              <td class="value" style="font-family: monospace;">${bookingId.substring(0, 8).toUpperCase()}…</td>
            </tr>
            <tr>
              <td class="label">Booking Date</td>
              <td class="value">${bookingDate.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
            </tr>
            ${visitDate ? `
            <tr>
              <td class="label">Visit Date</td>
              <td class="value">📅 ${visitDate.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
            </tr>` : ''}
            <tr>
              <td class="label">Total Members</td>
              <td class="value">${totalMembers} ${totalMembers === 1 ? 'Person' : 'People'}</td>
            </tr>
            <tr>
              <td class="label">Amount Paid</td>
              <td class="value" style="font-weight: 700; color: #1a1a2e;">${formatAmount(totalAmount)}</td>
            </tr>
            <tr>
              <td class="label">Transaction ID</td>
              <td class="value" style="font-family: monospace; color: #6b7280;">${transactionId}</td>
            </tr>
            <tr>
              <td class="label">Status</td>
              <td class="value"><span style="color: #059669; font-weight: 600;">✅ Confirmed &amp; Verified</span></td>
            </tr>
          </table>
        </div>

        <div class="section">
          <p class="section-title">Visitor Details (${totalMembers} ${totalMembers === 1 ? 'Ticket' : 'Tickets'})</p>
          ${members.map(m => `
          <div class="member-card">
            <p class="member-name">${m.name}</p>
            <p class="member-detail">Age: ${m.age} &nbsp;·&nbsp; ${m.email}</p>
          </div>`).join('')}
        </div>

        <div class="qr-section">
          <h3>🎟️ Your Entry Ticket</h3>
          <p>Show this QR code at the entry gate. Valid for all listed members.</p>
          <div class="qr-img">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(confirmationUrl)}" alt="Entry QR Code" width="200" height="200" />
          </div>
          <p class="qr-status">Status: <strong style="color: #059669;">Confirmed &amp; Verified</strong></p>
          <div style="margin-top: 20px;">
            <a href="${confirmationUrl}" class="cta-btn">View Full Ticket</a>
          </div>
        </div>

        <div class="notes">
          <strong>📌 Visit Guidelines</strong><br />
          • Please arrive <strong>15 minutes</strong> before your visit time.<br />
          • Carry a valid <strong>government-issued photo ID</strong>.<br />
          • This ticket is valid for all <strong>${totalMembers} listed member${totalMembers > 1 ? 's' : ''}</strong>.<br />
          • Photography rules may apply inside certain sections.<br />
          • Keep this email handy during your visit.
        </div>

        <div style="text-align: center;">
          <a href="${confirmationUrl}" class="cta-btn">View Full Ticket</a>
        </div>
      </div>
      <div class="footer">
        <p>Questions? <a href="mailto:${fromEmail}">Contact Support</a></p>
        <p>© ${new Date().getFullYear()} Ticketez. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const sendBookingPendingEmail = async (params: BookingEmailParams) => {
  try {
    await transporter.sendMail({
      from: fromAddress,
      to: params.to,
      subject: `Booking Received – Payment Verification in Progress | ${params.placeName}`,
      html: generatePendingTemplate(params),
    });
    return { success: true };
  } catch (error) {
    console.error('[Email] Failed to send pending email:', error);
    return { success: false, error };
  }
};

export const sendBookingConfirmedEmail = async (params: BookingEmailParams) => {
  try {
    await transporter.sendMail({
      from: fromAddress,
      to: params.to,
      subject: `Your Booking is Confirmed! 🎉 | ${params.placeName}`,
      html: generateConfirmedTemplate(params),
    });
    return { success: true };
  } catch (error) {
    console.error('[Email] Failed to send confirmed email:', error);
    return { success: false, error };
  }
};

// Re-export type for consumers
export type { BookingEmailParams };
