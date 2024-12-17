import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { SmsService } from 'src/auth/services/sms.service';
import { MailService } from 'src/auth/services/mail.service';
import { UsersModule } from 'src/users/users.module';
import { ActionLogsModule } from 'src/action-logs/action-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UsersModule,
    ActionLogsModule,
  ], // Add Notification to use repository in service.
  controllers: [NotificationsController],
  providers: [NotificationsService, SmsService, MailService],
})
export class NotificationsModule {}
