import {
  ConflictException,
  NotFoundException,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { compare } from 'bcrypt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  // Get User by Id.
  async getUserById(id: number) {
    if (!id) {
      throw new BadRequestException(`Id is required`);
    }

    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'username',
        'email',
        'phone',
        'role',
        'isActive',
        'profileImage',
        'fullName',
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

    const { password, refreshToken, ...result } = user;
    return result;
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

  //////////////////////////////////////// PATCH REQUESTS ////////////////////////////////////////

  // Update an User Info.
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    if (!id) {
      throw new BadRequestException(`Id is required`);
    }
    // Check if the user exists or not with id.
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

  /////////////////////////////// Update User Password ///////////////////////////////
  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    if (!(await compare(updatePasswordDto.oldPassword, user.password))) {
      throw new UnauthorizedException('Old password does not match');
    }

    if (updatePasswordDto.oldPassword === updatePasswordDto.newPassword) {
      throw new BadRequestException(
        'New password cannot be same as old password',
      );
    }

    const isPasswordValid = this.validatePassword(
      updatePasswordDto.newPassword,
    );
    if (!isPasswordValid) {
      throw new BadRequestException(
        'Password must be at least 8 characters long and contain at least one small, Capital & special character.',
      );
    }

    return this.userRepository.update(id, {
      password: bcrypt.hashSync(updatePasswordDto.newPassword, 10),
    });
  }

  validatePassword(password: string): boolean {
    const minLength = 8;
    const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z]).{8,}$/;

    if (!password || password.length < minLength || !regex.test(password)) {
      return false;
    }

    return true;
  }
}
