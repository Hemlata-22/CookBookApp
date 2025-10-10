import { Controller,Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
     constructor(private authService: AuthService) {}

  //For user registeration
  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string },
  ) {
    const { name, email, password } = body;
    //call service to handle user registration
    return this.authService.register(name, email, password);
  }

  // For user login
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    //call service to handle logic and JWT token generation
    return this.authService.login(email, password);
  }
}  