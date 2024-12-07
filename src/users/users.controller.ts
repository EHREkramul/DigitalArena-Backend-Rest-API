import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly appService: UsersService) {}

    // Request to get all users.
    @Get()
    getUsers() {
        return this.appService.getUsers();
    }
}
