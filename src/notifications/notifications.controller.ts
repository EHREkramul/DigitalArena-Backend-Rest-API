import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Public } from 'src/auth/decorators/public.decorator';
// import { Roles } from 'src/auth/decorators/roles.decorator';
// import { Role } from 'src/auth/enums/role.enum';
import { SendNotificationDto } from './dto/send-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // <------------------------------------------- Send Email/SMS Notification ------------------------------------------->
  //   @Roles(Role.ADMIN)
  @Public()
  @Post('sendNotification/:id')
  async sendNotification(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) sendNotificationDto: SendNotificationDto,
  ) {
    return this.notificationsService.sendNotification(id, sendNotificationDto);
  }
}
