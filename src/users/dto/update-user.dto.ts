import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsPhoneNumber,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('BD') // Validates phone numbers for Bangladesh
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean; // Default to true

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsString()
  fullName?: string;
}
