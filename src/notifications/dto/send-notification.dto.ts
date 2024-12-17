import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationStatus } from 'src/auth/enums/notification-status.enum';
import { NotificationType } from 'src/auth/enums/notification-type.enum';

export class SendNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  @IsEnum(NotificationStatus)
  status: NotificationStatus;
}
