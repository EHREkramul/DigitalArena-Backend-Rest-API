import { Module } from '@nestjs/common';
import { DownloadsController } from './downloads.controller';
import { DownloadsService } from './downloads.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Download } from 'src/entities/download.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Download])], // Add Download to use repository in service.
  controllers: [DownloadsController],
  providers: [DownloadsService],
})
export class DownloadsModule {}
