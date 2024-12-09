// mail.service.ts
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import emailConfig, { EmailConfig } from '../config/email.config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const config: EmailConfig = emailConfig();
    this.transporter = nodemailer.createTransport({
      host: config.emailHost,
      port: config.emailPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.emailSender, // your Gmail address
        pass: config.emailPassword, // your Gmail password or App Password
      },
    });
  }

  async sendPasswordResetEmail(to: string, fullName: string, token: string) {
    const resetLink = `http://localhost/digital-arena/reset-password-view.php?resetToken=${token}`;
    const mailOptions = {
      from: 'Digital Arena Authentication',
      to: to,
      subject: 'Digital Arena Password Reset Request',
      html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <div style="background-color: #007bff; padding: 20px; text-align: center;">
      <img src="cid:logo" alt="Digital Arena" style="max-width: 150px; margin-bottom: 10px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Password Reset Request</h1>
    </div>
    <div style="padding: 20px;">
      <p style="font-size: 16px; color: #555;">
        Hello ${fullName.split(' ')[0]},
      </p>
      <p style="font-size: 16px; color: #555;">
        You recently requested a password reset for your account. To reset your password, click the button below:
      </p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; padding: 12px 24px; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p style="font-size: 14px; color: #777;">
        If you didn't request a password reset, no further action is required. You can safely ignore this email.
      </p>
      <p style="font-size: 14px; color: #777;">
        For any issues, feel free to contact our support team.
      </p>
    </div>
    <div style="background-color: #f1f1f1; text-align: center; padding: 10px; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #777; margin: 0;">
        © 2024 Digital Arena. All Rights Reserved.
      </p>
    </div>
  </div>
</div>

`,
      attachments: [
        {
          filename: 'arena.png',
          path: './assets/User_Profile_Images/arena.png',
          cid: 'logo', // Same CID value as in the HTML content
        },
      ],
    };

    await this.transporter.sendMail(mailOptions);
  }
}
