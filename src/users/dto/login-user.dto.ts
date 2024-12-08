import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  identifier: string; // Can be either email or username.

  @IsNotEmpty()
  @IsString()
  password: string;
}
