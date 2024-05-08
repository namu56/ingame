import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  HttpStatus,
  HttpCode,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/auth.decorator';
import { JwtPayloadDto } from '../auth/dto/jwt-payload.dto';
import { ProfilePhotoDto } from './dto/profile-photo.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: CreateUserDto) {
    await this.usersService.createUser(createUserDto);
    return { message: 'success' };
  }

  @UseGuards(AuthGuard)
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@CurrentUser() user: JwtPayloadDto) {
    await this.usersService.deleteCurrentUserById(user.id);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@CurrentUser() user: JwtPayloadDto) {
    return await this.usersService.getUserById(user.id);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUserInfo(@CurrentUser() user: JwtPayloadDto, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.updateCurrenUserInfoById(user.id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch('me/profile-photo')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProfilePhoto(
    @CurrentUser() user: JwtPayloadDto,
    @Body() profilePhotoDto: ProfilePhotoDto
  ) {
    await this.usersService.updateProfilePhotoById(user.id, profilePhotoDto);
  }
}
