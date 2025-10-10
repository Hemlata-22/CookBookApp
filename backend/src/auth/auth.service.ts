import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    // user registration logic
  async register(name: string, email: string, password: string) {
    //check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) throw new Error('User already exists');

    //Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user in DB with hashed password
    return this.userService.create({
      name,
      email,
      password: hashedPassword,
    });
  }

  // user login logic
  async login(email: string, password: string) {
    //find user by email
    const user = await this.userService.findByEmail(email);
    if (!user) throw new Error('User not found');

    //compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Incorrect password');

    //prepare payload for JWT token
    const payload = { id: user.id, email: user.email, role: user.role };
    //Return access token to frontned
    return { access_token: this.jwtService.sign(payload) };
  }
}
