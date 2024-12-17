import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/auth/services/mail.service';
import { SmsService } from 'src/auth/services/sms.service';
import { Repository } from 'typeorm/repository/Repository';
import { Notification } from 'src/entities/notification.entity';
import { UsersService } from 'src/users/users.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationType } from 'src/auth/enums/notification-type.enum';
import { ActionType } from 'src/auth/enums/action-type.enum';
import { ActionLogsService } from 'src/action-logs/action-logs.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private readonly usersService: UsersService,
    private readonly actionLogsService: ActionLogsService,
  ) {}

  // <------------------------------------------- Send Email/SMS Notification ------------------------------------------->
  async sendNotification(
    userId: number,
    sendNotificationDto: SendNotificationDto,
  ) {
    // Validate user
    const user = await this.usersService.getUserById(userId);

    let result: any;
    if (sendNotificationDto.type === NotificationType.EMAIL) {
      // Send EMAIL notification
      result = await this.mailService.sendNotificationEmail(
        user.email,
        user.fullName,
        sendNotificationDto.title,
        sendNotificationDto.message,
      );
    } else if (sendNotificationDto.type === NotificationType.SMS) {
      // Send SMS notification
      result = await this.smsService.sendNotificationSMS(
        user.phone,
        user.fullName,
        sendNotificationDto.message,
      );
    } else {
      result = {
        success: false,
        message: 'Invalid notification type',
      };
    }

    if (!result.success) {
      throw new Error('Failed to send notification');
    }

    // Save notification to database
    let notification: Notification;
    try {
      notification = new Notification();
      notification.user.id = userId;
      notification.title = sendNotificationDto.title;
      notification.message = sendNotificationDto.message;
      notification.type = sendNotificationDto.type;

      await this.notificationRepository.save(notification);
    } catch (error) {
      console.log('Error saving notification to database: ', error);
    }

    try {
      // Update Action Log
      const actionLog = {
        action: ActionType.NOTIFICATION_SEND,
        description: `${notification.type} Notification sent to ${user.fullName}`,
        user: user,
      };
      await this.actionLogsService.createActionLog(actionLog);
    } catch (error) {
      console.log('Error updating action log: ', error);
    }

    return result;
  }
}
