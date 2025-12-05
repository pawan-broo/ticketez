import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface Member {
  name: string;
  age: number;
  email: string;
}

interface SendBookingConfirmationParams {
  to: string[];
  bookingId: string;
  placeName: string;
  placeLocation: string;
  bookingDate: Date;
  visitDate?: Date | null;
  totalMembers: number;
  members: Member[];
  confirmationUrl: string;
}

const generateEmailTemplate = ({
  bookingId,
  placeName,
  placeLocation,
  bookingDate,
  visitDate,
  totalMembers,
  members,
  confirmationUrl,
}: Omit<SendBookingConfirmationParams, 'to'>) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - ${placeName}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              
              <!-- Main Container -->
              <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                      🎫 Ticketez
                    </h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                      Your Journey Awaits
                    </p>
                  </td>
                </tr>

                <!-- Success Badge -->
                <tr>
                  <td style="padding: 30px 30px 0 30px; text-align: center;">
                    <div style="display: inline-block; background-color: #10b981; color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                      ✓ Booking Confirmed
                    </div>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: 700;">
                      ${placeName}
                    </h2>
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 16px; display: flex; align-items: center;">
                      📍 ${placeLocation}
                    </p>
                    <p style="margin: 0 0 30px 0; color: #9ca3af; font-size: 14px;">
                      Thank you for booking with Ticketez. Your adventure is confirmed!
                    </p>

                    <!-- Booking Details Card -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                      <tr>
                        <td style="padding: 20px;">
                          <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                            Booking Information
                          </h3>
                          
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">
                                Booking ID
                              </td>
                              <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; font-family: monospace;">
                                ${bookingId.substring(0, 8)}...
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                                Booking Date
                              </td>
                              <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">
                                ${bookingDate.toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </td>
                            </tr>
                            ${
                              visitDate
                                ? `
                            <tr>
                              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                                Visit Date
                              </td>
                              <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">
                                📅 ${visitDate.toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </td>
                            </tr>
                            `
                                : ''
                            }
                            <tr>
                              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                                Total Members
                              </td>
                              <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">
                                ${totalMembers} ${
    totalMembers === 1 ? 'Person' : 'People'
  }
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Members Card -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                      <tr>
                        <td style="padding: 20px;">
                          <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                            👥 Visitor Details
                          </h3>
                          
                          ${members
                            .map(
                              (member, index) => `
                            <div style="padding: 12px; background-color: #ffffff; border-radius: 6px; margin-bottom: ${
                              index === members.length - 1 ? '0' : '10px'
                            }; border-left: 3px solid #000000;">
                              <p style="margin: 0 0 5px 0; color: #1a1a1a; font-size: 15px; font-weight: 600;">
                                ${member.name}
                              </p>
                              <p style="margin: 0; color: #6b7280; font-size: 13px;">
                                Age: ${member.age} • ${member.email}
                              </p>
                            </div>
                          `,
                            )
                            .join('')}
                        </td>
                      </tr>
                    </table>

                    <!-- QR Code Section -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%); border-radius: 8px; overflow: hidden; border: 2px solid #e5e7eb;">
                      <tr>
                        <td style="padding: 30px; text-align: center;">
                          <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                            🎟️ Your Entry Ticket
                          </h3>
                          <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">
                            Show this QR code at the entry gate
                          </p>
                          
                          <!-- QR Code -->
                          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; display: inline-block; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                              confirmationUrl,
                            )}" alt="QR Code" style="width: 200px; height: 200px; display: block;">
                          </div>
                          
                          <div style="margin-top: 20px;">
                            <a href="${confirmationUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                              View Full Details
                            </a>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Important Notes -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #fef3c7; border-radius: 8px; overflow: hidden;">
                      <tr>
                        <td style="padding: 15px;">
                          <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.6;">
                            <strong>📌 Important:</strong><br>
                            • Please arrive 15 minutes before your visit time<br>
                            • Carry a valid ID proof<br>
                            • This ticket is valid for all listed members<br>
                            • Keep this email handy during your visit
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                      Need help? Contact us at <a href="mailto:support@ticketez.com" style="color: #000000; text-decoration: none; font-weight: 600;">support@ticketez.com</a>
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      © ${new Date().getFullYear()} Ticketez. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
              
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

export const sendBookingConfirmation = async (
  params: SendBookingConfirmationParams,
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Ticketez <onboarding@resend.dev>',
      to: params.to,
      subject: `🎫 Booking Confirmed - ${params.placeName}`,
      html: generateEmailTemplate(params),
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};
