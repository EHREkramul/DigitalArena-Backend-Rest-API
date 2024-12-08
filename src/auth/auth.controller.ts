import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';

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

  /////////////////////////////// Google Login Authentication ///////////////////////////////
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  /////////////////////////////// Google Login Callback Authentication ///////////////////////////////
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.login(req.user.id);

    res.redirect(
      `http://localhost:5173?token=${response.accessToken}&refreshToken=${response.refreshToken}`,
    );
  }
}
