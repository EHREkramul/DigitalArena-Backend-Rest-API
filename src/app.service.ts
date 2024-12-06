import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  HELLOAPI(): string {
    return 'Welcome to Digital Arena!';
  }
}
