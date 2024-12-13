import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Role } from '../enums/role.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfigurations: ConfigType<typeof googleOauthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: googleConfigurations.clientID,
      clientSecret: googleConfigurations.clientSecret,
      callbackURL: googleConfigurations.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    console.log(profile);
    const user = await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      username: profile.displayName.split(' ')[0].toLowerCase(),
      fullName: `${profile.name.givenName} ${profile.name.familyName}`,
      profileImage: profile.photos[0].value,
      password: '',
    });

    done(null, user);
  }
}
