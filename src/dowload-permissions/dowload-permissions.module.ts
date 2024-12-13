import { Module } from '@nestjs/common';
import { DowloadPermissionsController } from './dowload-permissions.controller';
import { DowloadPermissionsService } from './dowload-permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DownloadPermission } from 'src/entities/download-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DownloadPermission])], // Add Download to use repository in service.
  controllers: [DowloadPermissionsController],
  providers: [DowloadPermissionsService],
})
export class DowloadPermissionsModule {}
