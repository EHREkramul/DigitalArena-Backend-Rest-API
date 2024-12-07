import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // Injecting User Repository.
    private userRepository: Repository<User>,
  ) {}

  // Returns all users from db to controller.
  getUsers() {
    return this.userRepository.find(); // Fetch all users from db.
  }
}
