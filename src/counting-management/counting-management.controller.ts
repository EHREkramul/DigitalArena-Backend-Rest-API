import { Controller, Patch, Param } from '@nestjs/common';
import { CountingManagementService } from './counting-management.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('counting-management')
export class CountingManagementController {
  constructor(
    private readonly countingManagementService: CountingManagementService,
  ) {}

  @Public()
  @Patch('addLike/:productId')
  async addLike(@Param('productId') productId: string) {
    return this.countingManagementService.addLike(+productId);
  }

  @Public()
  @Patch('subLike/:productId')
  async subLike(@Param('productId') productId: string) {
    return this.countingManagementService.subLike(+productId);
  }

  @Public()
  @Patch('addView/:productId')
  async addView(@Param('productId') productId: string) {
    return this.countingManagementService.addView(+productId);
  }
}
