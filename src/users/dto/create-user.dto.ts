import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsPhoneNumber,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

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
  @IsString()
  profileImage?: string = 'avatar.jpg'; // Default avatar image

  @IsOptional()
  @IsString()
  fullName?: string;
}
