import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VerificationMethod } from '../enums/verification-method.enum';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @IsOptional()
  @IsEnum(VerificationMethod, {
    message: 'Verification Method must be either EMAIL or SMS',
  })
  verificationMethod?: VerificationMethod = VerificationMethod.EMAIL; // Default to EMAIL
}
