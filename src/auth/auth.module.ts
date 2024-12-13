import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { EntityPropertyNotFoundExceptionFilter } from 'src/property-not-found-exception-catcher';
import { UsersService } from 'src/users/users.service';
import { LocalStrategy } from './strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Verification } from 'src/entities/verification.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import refreshJwtConfig from './config/refresh-jwt.config';
import { RefreshJwtStrategy } from './strategies/refresh.strategy';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from './guards/roles/roles.guard';
import googleOauthConfig from './config/google-oauth.config';
import emailConfig from './config/email.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { MailService } from './services/mail.service';
import { SmsService } from './services/sms.service';
import { ActionLogsService } from 'src/action-logs/action-logs.service';
import { ActionLog } from 'src/entities/action-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Verification, ActionLog]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(googleOauthConfig),
    ConfigModule.forFeature(emailConfig),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    GoogleStrategy,
    {
      provide: APP_FILTER,
      useClass: EntityPropertyNotFoundExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // @UseGuards(JwtAuthGuard) in controller applied to all routes in all Project modules.
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // @UseGuards(RolesGuard) in controller applied to all routes in all Project modules.
    },
    AuthService,
    UsersService,
    MailService,
    SmsService,
    ActionLogsService,
  ],
})
export class AuthModule {}
