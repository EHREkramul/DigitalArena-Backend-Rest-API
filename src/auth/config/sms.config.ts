import * as dotenv from 'dotenv';

dotenv.config();

export interface SmsConfig {
  smsSenderId: string;
  smsApiKey: string;
  smsApiUrl: string;
}

export default (): SmsConfig => ({
  smsSenderId: process.env.SMS_SENDER_ID,
  smsApiKey: process.env.SMS_API_KEY,
  smsApiUrl: process.env.SMS_API_URL,
});
