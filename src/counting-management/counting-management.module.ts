import { Module } from '@nestjs/common';
import { CountingManagementService } from './counting-management.service';
import { CountingManagementController } from './counting-management.controller';
import { Product } from 'src/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [CountingManagementService],
  controllers: [CountingManagementController],
})
export class CountingManagementModule {}
