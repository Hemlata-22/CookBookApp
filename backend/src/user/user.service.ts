import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ name, email, password: hashedPassword });
    return this.userRepo.save(user);
  }
}
