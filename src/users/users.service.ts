import {
  ConflictException,
  NotFoundException,
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
<<<<<<< HEAD
=======
import { MailService } from 'src/auth/services/mail.service';
import { clearDirectory } from 'src/auth/utility/clear-directory.util';
import * as fs from 'fs';
import * as path from 'path';
>>>>>>> 2ce6cd9bdc18535ecdda71ab405f1ae3dc48bbc6

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  //////////////////////////////////////// GET REQUESTS ////////////////////////////////////////

  async getAllUsers() {
    return await this.userRepository.find({
      select: [
        'id',
        'username',
        'email',
        'fullName',
        'phone',
        'role',
        'isActive',
        'profileImage',
        'balance',
        'createdAt',
        'updatedAt',
        'lastLoginAt',
      ], // We don't want to send password on response.
      order: { id: 'ASC' },
    });
  }

  // Get User Profile by Id. Do not provide sensitive information like password, refreshToken.
  async getUserProfileInfo(id: number) {
    if (!id) {
      throw new BadRequestException(`Id is required`);
    }

    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'username',
        'email',
        'fullName',
        'phone',
        'role',
        'isActive',
        'profileImage',
        'balance',
        'createdAt',
        'updatedAt',
        'lastLoginAt',
      ],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  /*// Get User by username.
  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }*/

  //////////////////////////////////////// POST REQUESTS ////////////////////////////////////////

  // Create an User.
  async createUser(createUserDto: CreateUserDto) {
    if (!createUserDto.username.match(/^[a-z0-9]+$/)) {
      throw new BadRequestException(
        `Username can only contain small letters and numbers`,
      );
    }

    // Check if the user already exists.
    if (
      await this.userRepository.findOne({
        where: { email: createUserDto.email },
      })
    ) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    if (
      await this.userRepository.findOne({
        where: { username: createUserDto.username },
      })
    ) {
      throw new ConflictException(
        `User with username ${createUserDto.username} already exists`,
      );
    }

    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...result } = user;
    this.mailService.sendWelcomeEmail(result.email, result.fullName);
    return result;
  }

<<<<<<< HEAD
  //////// PATCH REQUESTS ////////

  // Updates an existing user in db.
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    // Check if the user exists.
=======
  //////////////////////////////////////// PATCH REQUESTS ////////////////////////////////////////

  // Update an User Info.
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    if (!id) {
      throw new BadRequestException(`Id is required`);
    }
    // Check if the user exists or not with id.
>>>>>>> 2ce6cd9bdc18535ecdda71ab405f1ae3dc48bbc6
    if (
      id !== undefined &&
      !(await this.userRepository.findOne({ where: { id } }))
    ) {
      throw new NotFoundException(`User with id ${id} not found`); // Throw exception if user not found.
    }

    // Check if the user already exists.
    if (
      updateUserDto.email !== undefined &&
      (await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      }))
    ) {
      throw new ConflictException(
        `User with email ${updateUserDto.email} already exists`,
      );
    }

    if (
      updateUserDto.username !== undefined &&
      (await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      }))
    ) {
      throw new ConflictException(
        `User with username ${updateUserDto.username} already exists`,
      );
    }

    if (
      updateUserDto.username !== undefined &&
      !updateUserDto.username.match(/^[a-z0-9]+$/)
    ) {
      throw new BadRequestException(
        `Username can only contain small letters and numbers`,
      );
    }

    const result = this.userRepository.update(id, updateUserDto); // Update the user.
    return result;
  }

  //////////////////////////////////////// DELETE REQUESTS ////////////////////////////////////////

  // Delete an User by id.
  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    // Check if the user exists or not with id.
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Check if id is not ADMIN.
    if (user.role === 'ADMIN') {
      throw new BadRequestException(`Admin cannot be deleted`);
    }

    const result = await this.userRepository.delete(id);
    return result;
  }

  //////////////////////////////////////// Other Methods ////////////////////////////////////////
  async updateHashedRefreshToken(userId: number, hashedRefreshToken: string) {
    return await this.userRepository.update(
      { id: userId },
      { refreshToken: hashedRefreshToken },
    );
  }

  // fetch complete user including all sensitive information.
  async getUserByIdWithCredential(id: number) {
    if (!id) {
      throw new BadRequestException(`Id is required`);
    }

    return await this.userRepository.findOne({
      where: { id },
    });
  }

  // Get users refresh token.
  async getUserRefreshTokenFromDB(id: number) {
    if (!id) {
      throw new BadRequestException(`Id is required`);
    }

    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'refreshToken'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  // Get User by Email.
  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  // Get User by Email or Username.
  async getUserByDynamicCredential(identifier: string) {
    // Get user by email or username.
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
    });

    return user;
  }

  // Update Last Login.
  async updateLastLogin(id: number) {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }

  // Change User Password.
  async changePassword(id: number, hashedPassword: string) {
    return this.userRepository.update(id, {
      password: hashedPassword,
    });
  }

  // Update User Profile Image.
  async updateProfileImage(userId: number, profileImageFileName: string) {
    if (!(await this.userRepository.findOne({ where: { id: userId } }))) {
      throw new NotFoundException(`User not found`);
    }

    const result = await this.userRepository.update(userId, {
      profileImage: profileImageFileName,
    });

    const uploadPath = path.join(
      __dirname,
      '..',
      '..',
      'assets',
      'user_profile_image',
      `user_${userId}`,
    );

    // Something went wrong while updating the user.
    if (result.affected === 0) {
      clearDirectory(
        uploadPath,
        (await this.userRepository.findOne({ where: { id: userId } }))
          .profileImage,
        'profileImage-',
      );
      throw new NotFoundException(`User not found`);
    }

    clearDirectory(uploadPath, profileImageFileName, 'profileImage-'); // Delete old files starting with "profileImage-" except the new file

    return {
      message: `Profile Image Updated Successfully`,
      userAffected: result.affected,
    };
  }

  // Get User Profile Image.
  async getUserProfileImage(userId: number, res: any) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    let imagePath = path.join(
      __dirname,
      '..',
      '..',
      'assets',
      'user_profile_image',
      `user_${userId}`,
      `${user.profileImage}`,
    );

    if (user.profileImage === 'avatar.jpg') {
      imagePath = path.join(
        __dirname,
        '..',
        '..',
        'assets',
        'user_profile_image',
        `${user.profileImage}`,
      );
    }

    // Check if the image exists
    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException(`Image file not found`);
    }

    // Stream the image file to the client
    res.sendFile(imagePath, (err) => {
      if (err) {
        throw new HttpException(
          'Unable to retrieve the profile image',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    return {
      message: `Profile Image Sent Successfully`,
    };
  }
}
