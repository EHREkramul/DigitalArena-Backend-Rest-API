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
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly appService: UsersService) {}

  /////////////////////////////// GET All Users ///////////////////////////////
  @UseGuards(JwtAuthGuard)
  @Get('getAllUsers')
  getAllUsers(@Req() req) {
    return this.appService.getAllUsers(req.user.id);
  }

  /////////////////////////////// GET User By ID ///////////////////////////////
  @UseGuards(JwtAuthGuard)
  @Get('getUserById')
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

  /////////////////////////////// Create User ///////////////////////////////
  @Post('createUser')
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.appService.createUser(createUserDto);
  }

  /////////////////////////////// Update an User Information ///////////////////////////////
  @UseGuards(JwtAuthGuard)
  @Patch('updateUser')
  updateUser(@Req() req, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    if (!req.user.id) {
      throw new BadRequestException(`Id is required`);
    }
    return this.appService.updateUser(req.user.id, updateUserDto);
  }

  /////////////////////////////// Delete an User ///////////////////////////////
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete('deleteUser/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteUser(id);
  }
}
