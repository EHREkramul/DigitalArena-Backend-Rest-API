import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsPhoneNumber,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

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
  @IsEnum(Role, { message: 'Role must be either BUYER or ADMIN' }) // Optional with a specific validation message
  role?: Role = Role.BUYER; // Default to BUYER

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true; // Default to true

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsString()
  fullName?: string;
}
