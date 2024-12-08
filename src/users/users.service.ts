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
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //////////////////////////////////////// GET REQUESTS ////////////////////////////////////////

  async getAllUsers(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    // Check if the user exists or not with id.
    if (!user) {
      throw new NotFoundException(`User not found`); // Throw exception if user not found.
    }

    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException(`Only Admin users can access this route`);
    }

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
      throw new NotFoundException(`Id is required`);
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  /*// Get User by Email.
  async getUserByEmail(email: string) {
    if (!email) {
      throw new NotFoundException(`Email is required`);
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  // Get User by username.
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
    return user;
  }

  // Get User by Email or Username.
  async getUserByDynamicCredential(identifier: string) {
    // Get user by email or username.
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
    });

    return user;
  }

  //////////////////////////////////////// PATCH REQUESTS ////////////////////////////////////////

  // Update an User Info.
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
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
  async deleteUser(id: number, requesterId: number) {
    // Validate requester permission.
    const requester = await this.userRepository.findOne({
      where: { id: requesterId },
    });
    if (!requester) {
      throw new NotFoundException(`Requester not found`);
    }

    // Check if the requester is not ADMIN.
    if (requester.role !== 'ADMIN') {
      throw new UnauthorizedException(`Only Admin users can access this route`);
    }

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
}
