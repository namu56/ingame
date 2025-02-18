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
  Param,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
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
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { IUserService, USER_SERVICE_KEY } from './interfaces/user-service.interface';
import { AccessTokenPayload } from 'src/common/dto/token';
import {
  CreateLocalUserRequest,
  UpdateProfilePhotoRequest,
  UpdateUserRequest,
} from '@common/requests/user';
import { UserResponse } from '@common/responses/user';

@Controller('users')
@ApiTags('Users API')
export class UserController {
  constructor(@Inject(USER_SERVICE_KEY) private readonly userService: IUserService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({ description: 'success' })
  @ApiConflictResponse({ description: '이미 존재하는 회원입니다.' })
  @ApiBody({ type: CreateLocalUserRequest })
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() request: CreateLocalUserRequest) {
    await this.userService.localSignUp(request);
    return { message: 'success' };
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '회원탈퇴' })
  @ApiBearerAuth('accessToken')
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'Unauthenticated' })
  @ApiForbiddenResponse({ description: 'Fail - Invalid token' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@CurrentUser() user: AccessTokenPayload) {
    await this.userService.deleteUserById(user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '나의 정보 조회' })
  @ApiBearerAuth('accessToken')
  @ApiOkResponse({ type: UserResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated' })
  @ApiForbiddenResponse({ description: 'Fail - Invalid token' })
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@CurrentUser() user: AccessTokenPayload): Promise<UserResponse> {
    return await this.userService.findUserById(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '사용자 정보 수정' })
  @ApiBearerAuth('accessToken')
  @ApiNoContentResponse({ description: '사용자 정보 수정 성공' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated' })
  @ApiForbiddenResponse({ description: 'Fail - Invalid token' })
  @ApiConflictResponse({ description: '닉네임이 이미 사용 중입니다' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUserInfo(
    @CurrentUser() user: AccessTokenPayload,
    @Body() request: UpdateUserRequest
  ) {
    await this.userService.updateUserInfoById(user.id, request);
  }

  @Patch('me/profile-photo')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '프로필 사진 수정' })
  @ApiBearerAuth('accessToken')
  @ApiNoContentResponse({ description: '프로필 사진 수정 성공' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated' })
  @ApiForbiddenResponse({ description: 'Fail - Invalid token' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProfilePhoto(
    @CurrentUser() user: AccessTokenPayload,
    @Body() request: UpdateProfilePhotoRequest
  ) {
    await this.userService.updateProfilePhotoById(user.id, request);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 유저의 정보 조회' })
  @ApiOkResponse({ type: UserResponse })
  @ApiNotFoundResponse({ description: 'Fail - User not found' })
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserResponse> {
    return await this.userService.findUserById(id);
  }
}
