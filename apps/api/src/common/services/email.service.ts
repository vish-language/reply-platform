import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error("RESEND_API_KEY is required");
}

const resend = new Resend(apiKey);

export class EmailService {
  static async sendInvitationEmail(data: {
    email: string;
    name: string;
    organizationName: string;
    token: string;
  }) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const invitationUrl = `${frontendUrl}/accept-invitation?token=${data.token}`;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "ReplyAI <onboarding@resend.dev>",

      to: data.email,

      subject: "You're invited to join ReplyAI",

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>You're invited to ReplyAI</h1>

          <p>Hello ${data.name},</p>

          <p>
            You have been invited to join
            <strong>${data.organizationName}</strong>
            on ReplyAI.
          </p>

          <p>
            ReplyAI helps businesses manage customer reviews
            and generate AI-powered responses.
          </p>

          <p style="margin: 30px 0;">
            <a
              href="${invitationUrl}"
              style="
                background: #000;
                color: #fff;
                padding: 12px 20px;
                text-decoration: none;
                border-radius: 6px;
                display: inline-block;
              "
            >
              Accept Invitation
            </a>
          </p>

          <p>
            This invitation will expire in 7 days.
          </p>

          <p>
            If you did not expect this invitation,
            you can safely ignore this email.
          </p>

          <p>
            — ReplyAI
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.error("INVITATION EMAIL ERROR:", result.error);

      throw new Error("Failed to send invitation email");
    }

    console.log("INVITATION EMAIL SENT:", data.email);

    return result.data;
  }
}
