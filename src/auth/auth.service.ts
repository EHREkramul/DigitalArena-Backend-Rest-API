import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2';
import { CurrentUser } from './types/current-user';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
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
    console.log(user);

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
    const user = await this.userService.getUserById(userId);

    if (!user) throw new UnauthorizedException(`User not found`);

    const currentUser: CurrentUser = {
      id: user.id,
      role: user.role,
    };
    return currentUser;
  }
}
