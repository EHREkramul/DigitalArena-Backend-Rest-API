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
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Public } from 'src/auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { extname } from 'path';
import { CurrentUser } from 'src/auth/types/current-user';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /////////////////////////////// GET All Users ///////////////////////////////
  @Roles(Role.ADMIN)
  @Get('getAllUsers')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  /////////////////////////////// GET User Profile ///////////////////////////////
  @Get('getUserProfileInfo')
  getUserProfile(@Req() req: any) {
    return this.usersService.getUserProfileInfo(req.user.id);
  }

  /////////////////////////////// GET User Profile Image ///////////////////////////////
  @Get('getUserProfileImage')
  getUserProfileImage(@Req() req: any, @Res() res: Response) {
    return this.usersService.getUserProfileImage(req.user.id, res);
  }

  /////////////////////////////// Create User ///////////////////////////////
  @Public()
  @Post('createUser')
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  /////////////////////////////// Update an User Information ///////////////////////////////
  @Patch('updateUser')
  updateUser(
    @Req() req: any,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(req.user.id, updateUserDto);
  }

  /////////////////////////////// Update an User Role ///////////////////////////////
  @Roles(Role.ADMIN)
  @Patch('updateUserRole/:id')
  updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserRoleDto: UpdateUserRoleDto,
    @Req() req: any,
  ) {
    return this.usersService.updateUserRole(id, updateUserRoleDto, req.user.id);
  }

  /////////////////////////////// Delete an User ///////////////////////////////
  @Roles(Role.ADMIN)
  @Delete('deleteUser/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.usersService.deleteUser(id, req.user.id);
  }

  /////////////////////////////// Update User Profile Image ///////////////////////////////
  @Patch('updateProfileImage')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const currentUser: CurrentUser = req.user as CurrentUser;
          const userId = currentUser.id;

          const uploadPath = path.join(
            __dirname,
            '..',
            '..',
            'assets',
            'user_profile_image',
            `user_${userId}`,
          );

          // Ensure the directory exists or create it dynamically
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath); // Set the destination folder.
        },
        filename: (req, file, cb) => {
          const currentUser: CurrentUser = req.user as CurrentUser;
          const userId = currentUser.id;

          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `profileImage-user-${userId}-${uniqueSuffix}${fileExt}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Accept only image files.
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(
            new HttpException(
              'Only image files are allowed (jpg, jpeg, png, gif)',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit to 5 MB.
    }),
  )
  async updateProfileImage(
    @UploadedFile() profileImage: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!profileImage) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.updateProfileImage(
      req.user.id,
      profileImage.filename,
    );
  }

  /////////////////////////////// Get User by ID ///////////////////////////////
  @Roles(Role.ADMIN)
  @Get('getUserById/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  /////////////////////////////// Insert Bulk Users(Temp-Only in Dev Mode) ///////////////////////////////
  @Public()
  @Post('insertBulkUsers')
  insertBulkUsers(@Body(ValidationPipe) createUserDto: CreateUserDto[]) {
    return this.usersService.insertBulkUsers(createUserDto);
  }
}
