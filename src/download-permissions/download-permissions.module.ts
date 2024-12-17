import { Module } from '@nestjs/common';
import { DownloadPermissionsController } from './download-permissions.controller';
import { DownloadPermissionsService } from './download-permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DownloadPermission } from 'src/entities/download-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DownloadPermission])],
  controllers: [DownloadPermissionsController],
  providers: [DownloadPermissionsService],
})
export class DownloadPermissionsModule {}
