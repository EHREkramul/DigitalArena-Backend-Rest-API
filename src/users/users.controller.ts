import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly appService: UsersService) {}

  //////// GET REQUESTS ////////

  @Get('getUsers') // Request to get all users. Get all the information stored in database of users.
  getUsers() {
    return this.appService.getUsers();
  }

  @Get('getUserById') // Request to get individual user by id. Get all the information stored in database of an user.
  getUserById(@Query('id', ParseIntPipe) id: number) {
    return this.appService.getUserById(id);
  }

  @Get('getUserByEmail') // Request to get individual user by email. Get all the information stored in database of an user.
  getUserByEmail(@Query('email') email: string) {
    return this.appService.getUserByEmail(email);
  }

  @Get('getUserByUsername/:username') // Request to get individual user by username. Get all the information stored in database of an user.
  getUserByUsername(@Param('username') username: string) {
    return this.appService.getUserByUsername(username);
  }

  //////// POST REQUESTS ////////

  @Post('createUser') // Request to create a new user. Create a new user and store in database.
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.appService.createUser(createUserDto);
  }

  //////// PATCH REQUESTS ////////

  @Patch('updateUser/:id') // Request to update an user by id. Update the information stored in database of an user.
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.appService.updateUser(id, updateUserDto);
  }
}
