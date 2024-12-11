import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  ValidationPipe,
  Delete,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly appService: UsersService) {}

  /////////////////////////////// GET All Users ///////////////////////////////
  @Roles(Role.ADMIN)
  @Get('getAllUsers')
  getAllUsers() {
    return this.appService.getAllUsers();
  }

  /////////////////////////////// GET User Profile By ID ///////////////////////////////
  @Get('getUserById')
  getUserById(@Req() req) {
    return this.appService.getUserProfile(req.user.id);
  }

  /*@Get('getUserByEmail') // Request to get individual user by email. Get all the information stored in database of an user.
  getUserByEmail(@Query('email') email: string) {
    return this.appService.getUserByEmail(email);
  }

  @Get('getUserByUsername/:username') // Request to get individual user by username. Get all the information stored in database of an user.
  getUserByUsername(@Param('username') username: string) {
    return this.appService.getUserByUsername(username);
  }*/

  /////////////////////////////// Create User ///////////////////////////////
  @Public()
  @Post('createUser')
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.appService.createUser(createUserDto);
  }

  /////////////////////////////// Update an User Information ///////////////////////////////
  @Patch('updateUser')
  updateUser(@Req() req, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    return this.appService.updateUser(req.user.id, updateUserDto);
  }

  /////////////////////////////// Delete an User ///////////////////////////////
  @Roles(Role.ADMIN)
  @Delete('deleteUser/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteUser(id);
  }

  /////////////////////////////// Update User Profile Image ///////////////////////////////
}
