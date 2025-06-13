import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../entites/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: Record<string, string>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('clinics')
  @UseGuards(AuthGuard)
  getClinic(@Req() request) {
    const user: User = request['user'];
    return this.authService.getClinics(user.id);
  }
}
