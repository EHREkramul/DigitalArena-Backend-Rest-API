import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /////////////////////////////// User Login Authentication ///////////////////////////////
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user.id);
  }

  /////////////////////////////// Refresh Token Authentication ///////////////////////////////
  @Public() // Refresh token auth will applied not jwt auth.
  @UseGuards(RefreshAuthGuard)
  @Post('refreshToken')
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user.id);
  }

  /////////////////////////////// User Logout Authentication ///////////////////////////////
  @Post('logout')
  async logout(@Req() req) {
    this.authService.logout(req.user.id);
    return { message: 'Logout successful' };
  }
}
