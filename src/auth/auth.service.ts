import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2';
import { CurrentUser } from './types/current-user';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { nanoid } from 'nanoid';
import { Verification } from 'src/entities/verification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationType } from './enums/verification.enum';
import { MailService } from './services/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    @InjectRepository(Verification)
    private verificationRepository: Repository<Verification>,
  ) {}

  async validateUser(identifier: string, password: string) {
    const user = await this.userService.getUserByDynamicCredential(identifier);

    if (!user)
      throw new UnauthorizedException(`User for ${identifier} not found`);

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid Credentials');

    return { id: user.id };
  }

  async login(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    this.userService.updateLastLogin(userId); // Update last login date

    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(id: number) {
    const payload: AuthJwtPayload = { sub: id };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.getUserRefreshTokenFromDB(userId);

    if (!user || !user.refreshToken)
      throw new UnauthorizedException(`Invalid refresh token`);

    const isRefreshTokenMatching = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!isRefreshTokenMatching)
      throw new UnauthorizedException('Invalid Refresh Token');

    return { id: user.id };
  }

  async logout(userId: number) {
    return await this.userService.updateHashedRefreshToken(userId, null);
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.getUserProfile(userId);

    if (!user) throw new UnauthorizedException(`User not found`);

    const currentUser: CurrentUser = {
      id: user.id,
      role: user.role,
    };
    return currentUser;
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.getUserByEmail(googleUser.email);

    if (user) return user;

    return await this.userService.createUser(googleUser);
  }

  /////////////////////////////// Change User Password ///////////////////////////////
  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.userService.getUserByIdWithCredential(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    if (!(await compare(changePasswordDto.oldPassword, user.password))) {
      throw new UnauthorizedException('Old password does not match');
    }

    if (changePasswordDto.oldPassword === changePasswordDto.newPassword) {
      throw new BadRequestException(
        'New password cannot be same as old password',
      );
    }

    const hashedPassword = bcrypt.hashSync(changePasswordDto.newPassword, 10);
    const result = this.userService.changePassword(id, hashedPassword);
    return {
      message: 'Password changed successfully',
      generatedMaps: (await result).generatedMaps,
      raw: (await result).raw,
      affected: (await result).affected,
    };
  }

  /////////////////////////////// Forgot Password ///////////////////////////////
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.getUserByDynamicCredential(
      forgotPasswordDto.identifier,
    );
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const resetToken = nanoid(64);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expires in 1 hour

    const verificationData = this.verificationRepository.create({
      type: VerificationType.PASSWORD_RESET_TOKEN,
      tokenOrOtp: resetToken,
      user: user,
      expiresAt: expiresAt,
    });
    await this.verificationRepository.save(verificationData);

    this.mailService.sendPasswordResetEmail(
      user.email,
      user.fullName,
      resetToken,
    );

    const maskedEmail = this.maskEmail(user.email);
    return {
      message: `Password reset link sent to your email ${maskedEmail}`,
    };
  }

  maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const maskedLocalPart =
      localPart.substring(0, 3) + '***' + localPart.slice(-1);
    return `${maskedLocalPart}@${domain}`;
  }

  /////////////////////////////// Reset Password ///////////////////////////////
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const verificationObj = await this.verificationRepository.findOne({
      where: {
        tokenOrOtp: resetPasswordDto.resetToken,
        type: VerificationType.PASSWORD_RESET_TOKEN,
      },
      relations: ['user'], // It will include user object in the response. Access by verificationObj.user
    });

    if (!verificationObj) {
      throw new UnauthorizedException('Invalid or expired Link');
    }

    const user = verificationObj.user;
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (verificationObj.expiresAt < new Date()) {
      throw new BadRequestException('Token has expired');
    }

    const hashedPassword = bcrypt.hashSync(resetPasswordDto.newPassword, 10);
    await this.userService.changePassword(user.id, hashedPassword);

    await this.verificationRepository.delete(verificationObj.id);

    return { message: 'Password reset successful' };
  }
}
