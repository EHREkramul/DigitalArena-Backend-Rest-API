import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly senderId: string;
  private readonly logger = new Logger(SmsService.name);

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('smsApiUrl');
    this.apiKey = this.configService.get<string>('smsApiKey');
    this.senderId = this.configService.get<string>('smsSenderId');
  }

  async sendOtp(phoneNumber: string, otp: string): Promise<any> {
    const message = `Your Digital Arena Reset Password OTP is ${otp}.\nThis code will expire in 2 minutes.\n\nPlease do not share this OTP with anyone.`;
    const params = {
      api_key: this.apiKey,
      senderid: this.senderId,
      number: phoneNumber,
      message: message, // URL encode the message
    };

    try {
      const response = await axios.post(this.apiUrl, null, { params });
      //   console.log(response.data); // Check sms status response object.
      if (response.data.response_code === 202) {
        this.logger.log('SMS sent successfully');
        return { success: true, message: 'OTP sent successfully' };
      } else {
        this.logger.error(
          `Failed to send SMS. Error: ${response.data.error_message}`,
        );
        return { success: false, error: response.data.success_message };
      }
    } catch (error) {
      this.logger.error(`Failed to send SMS. Error: ${error.message}`);
      throw new Error('Unable to send SMS at this time');
    }
  }
}
