import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Req,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { Public } from './decorators/public.decorator';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  /////////////////////////////// Change User Password ///////////////////////////////
  @Patch('changePassword')
  async updatePassword(
    @Req() req: any,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }

  /////////////////////////////// Forgot User Password ///////////////////////////////
  @Public()
  @Post('forgotPassword')
  async forgotPassword(
    @Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  /////////////////////////////// Reset User Password ///////////////////////////////
  @Public()
  @Put('resetPassword')
  async resetPassword(
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
