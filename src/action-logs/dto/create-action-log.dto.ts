import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ActionType } from 'src/auth/enums/action-type.enum';
import { User } from 'src/entities/user.entity';

export class CreateActionLogDto {
  @IsEnum(ActionType, { message: 'Invalid action type.' }) // Validate against the ActionType enum
  @IsNotEmpty({ message: 'Action type is required.' })
  action: ActionType;

  @IsOptional()
  @IsString({ message: 'Description must be a string.' }) // Ensure it's a string
  description?: string;

  @IsOptional() // User ID is optional (e.g., for unauthenticated actions)
  user?: User | null;
}
