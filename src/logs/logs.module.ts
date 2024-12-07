import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from 'src/entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Log])], // Add Log to use repository in service.
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
