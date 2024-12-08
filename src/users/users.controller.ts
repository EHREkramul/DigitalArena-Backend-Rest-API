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
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly appService: UsersService) {}

  //////////////////////////////////////// GET REQUESTS ////////////////////////////////////////

  @UseGuards(JwtAuthGuard)
  @Get('getAllUsers') // Request to get all users. Get all the information stored in database of users.
  getAllUsers(@Req() req) {
    return this.appService.getAllUsers(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getUserById') // Request to get individual user by id. Get all the information stored in database of an user.
  getUserById(@Req() req) {
    return this.appService.getUserById(req.user.id);
  }

  /*@Get('getUserByEmail') // Request to get individual user by email. Get all the information stored in database of an user.
  getUserByEmail(@Query('email') email: string) {
    return this.appService.getUserByEmail(email);
  }

  @Get('getUserByUsername/:username') // Request to get individual user by username. Get all the information stored in database of an user.
  getUserByUsername(@Param('username') username: string) {
    return this.appService.getUserByUsername(username);
  }*/

  //////////////////////////////////////// POST REQUESTS ////////////////////////////////////////

  @Post('createUser') // Request to create a new user. Create a new user and store in database.
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.appService.createUser(createUserDto);
  }

  //////////////////////////////////////// PATCH REQUESTS ////////////////////////////////////////

  @UseGuards(JwtAuthGuard)
  @Patch('updateUser') // Request to update an user by id. Update the information stored in database of an user.
  updateUser(@Req() req, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    if (!req.user.id) {
      throw new BadRequestException(`Id is required`);
    }
    return this.appService.updateUser(req.user.id, updateUserDto);
  }

  //////////////////////////////////////// DELETE REQUESTS ////////////////////////////////////////

  @UseGuards(JwtAuthGuard)
  @Delete('deleteUser/:id') // Request to delete an user by id. Delete the information stored in database of an user.
  deleteUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const requesterId = req.user.id;
    return this.appService.deleteUser(id, requesterId);
  }
}
