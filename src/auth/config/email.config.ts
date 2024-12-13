// email.config.ts
export interface EmailConfig {
  emailHost: string;
  emailPort: number;
  emailSender: string;
  emailPassword: string;
}

export default (): EmailConfig => ({
  emailHost: process.env.EMAIL_HOST,
  emailPort: parseInt(process.env.EMAIL_PORT, 10),
  emailSender: process.env.EMAIL_SENDER,
  emailPassword: process.env.EMAIL_PASSWORD,
});
