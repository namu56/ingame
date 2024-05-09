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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/auth.decorator';
import { JwtPayload } from '../auth/auth.interface';
import { ProfilePhotoDto } from './dto/profile-photo.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
@ApiTags('Users API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({ description: 'success' })
  @ApiConflictResponse({ description: '이미 존재하는 회원입니다.' })
  @ApiBody({ type: CreateUserDto })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: CreateUserDto) {
    await this.usersService.createUser(createUserDto);
    return { message: 'success' };
  }

  @UseGuards(AuthGuard)
  @Delete('me')
  @ApiOperation({ summary: '회원탈퇴' })
  @ApiBearerAuth('accessToken')
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'Unauthenticated' })
  @ApiForbiddenResponse({ description: 'Fail - Invalid token' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@CurrentUser() user: JwtPayload) {
    await this.usersService.deleteCurrentUserById(user.id);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({ summary: '나의 정보 조회' })
  @ApiBearerAuth('accessToken')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated' })
  @ApiForbiddenResponse({ description: 'Fail - Invalid token' })
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
    return await this.usersService.getUserById(user.id);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  @ApiOperation({ summary: '사용자 정보 수정' })
  @ApiBearerAuth('accessToken')
  @ApiNoContentResponse({ description: '사용자 정보 수정 성공' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated' })
  @ApiForbiddenResponse({ description: 'Fail - Invalid token' })
  @ApiConflictResponse({ description: '닉네임이 이미 사용 중입니다' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUserInfo(@CurrentUser() user: JwtPayload, @Body() updateUserDto: UpdateUserDto) {
    console.log(user);
    await this.usersService.updateCurrenUserInfoById(user.id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch('me/profile-photo')
  @ApiOperation({ summary: '프로필 사진 수정' })
  @ApiBearerAuth('accessToken')
  @ApiNoContentResponse({ description: '프로필 사진 수정 성공' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated' })
  @ApiForbiddenResponse({ description: 'Fail - Invalid token' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProfilePhoto(
    @CurrentUser() user: JwtPayload,
    @Body() profilePhotoDto: ProfilePhotoDto
  ) {
    await this.usersService.updateProfilePhotoById(user.id, profilePhotoDto);
  }
}
