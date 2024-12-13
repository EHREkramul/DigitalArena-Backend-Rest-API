import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // Injecting User Repository.
    private userRepository: Repository<User>,
  ) {}

  //////// GET REQUESTS ////////

  // Returns all users from db. All the information stored in database of users.
  async getUsers() {
    return await this.userRepository.find(); // Fetch all users from db.
  }

  // Returns individual user by id from db. All the information stored in database of an user.
  async getUserById(id: number) {
    if (!id) {
      throw new NotFoundException(`Id is required`); // Throw exception if id is not provided
    }
    const user = await this.userRepository.findOne({ where: { id } }); // Fetch user by id from db.
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`); // Throw exception if user not found.
    }
    return user; // Return user if found.
  }

  // Returns individual user by email from db. All the information stored in database of an user.
  async getUserByEmail(email: string) {
    if (!email) {
      throw new NotFoundException(`Email is required`); // Throw exception if email is not provided
    }
    const user = await this.userRepository.findOne({ where: { email } }); // Fetch user by email from db.
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`); // Throw exception if user not found.
    }
    return user; // Return user if found.
  }

  // Returns individual user by username from db. All the information stored in database of an user.
  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOne({ where: { username } }); // Fetch user by username from db.
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`); // Throw exception if user not found.
    }
    return user; // Return user if found.
  }

  //////// POST REQUESTS ////////

  // Creates a new user and store in db.
  async createUser(createUserDto: CreateUserDto) {
    // Check if username contains only small letters and numbers.
    if (!createUserDto.username.match(/^[a-z0-9]+$/)) {
      throw new NotFoundException(
        `Username can only contain small letters and numbers`,
      );
    }

    // Check if the user already exists.
    if (
      await this.userRepository.findOne({
        where: { email: createUserDto.email },
      })
    ) {
      throw new NotFoundException(
        `User with email ${createUserDto.email} already exists`,
      );
    } else if (
      await this.userRepository.findOne({
        where: { username: createUserDto.username },
      })
    ) {
      throw new NotFoundException(
        `User with username ${createUserDto.username} already exists`,
      );
    }

    const user = this.userRepository.create(createUserDto); // Create a new user.
    await this.userRepository.save(user); // Save the user in db.
    return user; // Return the user.
  }

  //////// PATCH REQUESTS ////////

  // Updates an existing user in db.
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    // Check if the user exists.
    if (
      !(await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      }))
    ) {
      throw new NotFoundException(
        `User with email ${updateUserDto.email} not found`,
      );
    }

    const user = this.userRepository.create(updateUserDto); // Create a new user.
    await this.userRepository.save(user); // Save the user in db.
    return user; // Return the user.
  }
}
