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
        <title>Booking Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              
              <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #2d2a45; padding: 40px 40px 30px 40px;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">
                      Ticketez
                    </h1>
                  </td>
                </tr>

                <!-- Confirmation Message -->
                <tr>
                  <td style="padding: 30px 40px 20px 40px;">
                    <h2 style="margin: 0 0 8px 0; color: #2d2a45; font-size: 24px; font-weight: 600;">
                      ${placeName}
                    </h2>
                    <p style="margin: 0; color: #6b7280; font-size: 15px;">
                      ${placeLocation}
                    </p>
                  </td>
                </tr>

                <!-- Booking Details -->
                <tr>
                  <td style="padding: 0 40px 30px 40px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
                      <tr>
                        <td style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb;">
                          <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 13px;">Order Total</p>
                          <p style="margin: 0; color: #2d2a45; font-size: 15px; font-weight: 500;">Free</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb;">
                          <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 13px;">Booking Date</p>
                          <p style="margin: 0; color: #2d2a45; font-size: 15px; font-weight: 500;">
                            ${bookingDate.toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </td>
                      </tr>
                      ${
                        visitDate
                          ? `
                      <tr>
                        <td style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb;">
                          <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 13px;">Visit Date</p>
                          <p style="margin: 0; color: #2d2a45; font-size: 15px; font-weight: 500;">
                            ${visitDate.toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </td>
                      </tr>
                      `
                          : ''
                      }
                      <tr>
                        <td style="padding: 16px 20px;">
                          <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 13px;">Order #${bookingId.substring(0, 8).toUpperCase()}</p>
                          <p style="margin: 0; color: #2d2a45; font-size: 13px;">
                            ${bookingDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Visitor Details -->
                <tr>
                  <td style="padding: 0 40px 30px 40px;">
                    <h3 style="margin: 0 0 16px 0; color: #2d2a45; font-size: 16px; font-weight: 600;">
                      ${totalMembers} ${totalMembers === 1 ? 'Ticket' : 'Tickets'}
                    </h3>
                    
                    ${members
                      .map(
                        (member) => `
                      <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; margin-bottom: 12px;">
                        <tr>
                          <td style="padding: 16px 20px;">
                            <p style="margin: 0 0 4px 0; color: #2d2a45; font-size: 15px; font-weight: 500;">
                              ${member.name}
                            </p>
                            <p style="margin: 0; color: #6b7280; font-size: 13px;">
                              Age ${member.age} · ${member.email}
                            </p>
                          </td>
                        </tr>
                      </table>
                    `,
                      )
                      .join('')}
                  </td>
                </tr>

                <!-- QR Code -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; padding: 30px; text-align: center;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 20px 0; color: #2d2a45; font-size: 15px; font-weight: 500;">
                            Your Ticket QR Code
                          </p>
                          <div style="background-color: #ffffff; padding: 20px; display: inline-block; border: 1px solid #e5e7eb;">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                              confirmationUrl,
                            )}" alt="QR Code" style="width: 200px; height: 200px; display: block;">
                          </div>
                          <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 13px;">
                            Show this code at entry
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td style="padding: 0 40px 40px 40px; text-align: center;">
                    <a href="${confirmationUrl}" style="display: inline-block; background-color: #2d2a45; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 15px; font-weight: 500; border-radius: 4px;">
                      View Full Details
                    </a>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; text-align: center;">
                      Questions about this event?
                    </p>
                    <p style="margin: 0; text-align: center;">
                      <a href="mailto:support@ticketez.com" style="color: #2d2a45; text-decoration: none; font-size: 14px; font-weight: 500;">
                        Contact the organizer
                      </a>
                    </p>
                  </td>
                </tr>

                <!-- Bottom Footer -->
                <tr>
                  <td style="padding: 20px 40px; text-align: center;">
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
      subject: `Your ticket for ${params.placeName}`,
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