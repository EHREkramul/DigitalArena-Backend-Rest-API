import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmsService } from './sms.service';
import smsConfig from '../config/sms.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [smsConfig],
    }),
  ],
  controllers: [],
  providers: [SmsService],
})
export class SmsModule {}
