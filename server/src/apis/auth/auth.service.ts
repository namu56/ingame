import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    console.log(email);
    const user = await this.usersService.getUserByEmail(email);
    console.log(user);
    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!user || !verifyPassword) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayloadDto = {
      id: user.id,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }
}
