import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])], // Add Notification to use repository in service.
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
