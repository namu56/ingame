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
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AccessTokenPayload } from '../auth/auth.interface';
import { ProfilePhotoDto } from './dto/profile-photo.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserProfileDto } from './dto/user-profile.dto';

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
  async deleteUser(@CurrentUser() user: AccessTokenPayload) {
    await this.usersService.deleteCurrentUserById(user.id);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({ summary: '나의 정보 조회' })
  @ApiBearerAuth('accessToken')
  @ApiOkResponse({ type: UserProfileDto })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated' })
  @ApiForbiddenResponse({ description: 'Fail - Invalid token' })
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@CurrentUser() user: AccessTokenPayload): Promise<UserProfileDto> {
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
  async updateUserInfo(
    @CurrentUser() user: AccessTokenPayload,
    @Body() updateUserDto: UpdateUserDto
  ) {
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
    @CurrentUser() user: AccessTokenPayload,
    @Body() profilePhotoDto: ProfilePhotoDto
  ) {
    await this.usersService.updateProfilePhotoById(user.id, profilePhotoDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 유저의 정보 조회' })
  @ApiOkResponse({ type: UserProfileDto })
  @ApiNotFoundResponse({ description: 'Fail - User not found' })
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserProfileDto> {
    return await this.usersService.getUserById(id);
  }
}
