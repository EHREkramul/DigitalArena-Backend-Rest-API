import { Module } from '@nestjs/common';
import { ActionLogsController } from './action-logs.controller';
import { ActionLogsService } from './action-logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionLog } from 'src/entities/action-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActionLog])], // Add Action Log to use repository in service.
  controllers: [ActionLogsController],
  providers: [ActionLogsService],
})
export class ActionLogsModule {}
