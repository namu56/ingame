import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from '../../entities/user/user.entity';
import { UserInfo } from '../../entities/user-info/user-info.entity';
import { ConfigService } from '@nestjs/config';
import { LevelCalculatorService } from 'src/core/level-calculator/level-calculator.service';
import { v4 as uuidv4 } from 'uuid';
import { Transactional } from 'src/core/decorators/transactional.decorator';
import { encryptValue } from 'src/common/utils/encrypt-value.util';
import { IUserService } from './interfaces/user-service.interface';
import { IUserRepository, USER_REPOSITORY_KEY } from 'src/entities/user/user-repository.interface';
import {
  IUserInfoRepository,
  USER_INFO_REPOSITORY_KEY,
} from 'src/entities/user-info/user-info-repository.interface';
import {
  IProfilePhotoRepository,
  PROFILE_PHOTO_REPOSITORY_KEY,
} from 'src/entities/profile-photo/profile-photo-repository.interface';
import { ProfilePhoto } from 'src/entities/profile-photo/profile-photo.entity';
import {
  CreateLocalUserRequest,
  CreateSocialUserRequest,
  UpdateProfilePhotoRequest,
  UpdateUserRequest,
} from 'src/common/requests/user';
import { UserResponse } from 'src/common/responses/user';
import { UserProvider } from 'src/common/types/user/user.type';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_REPOSITORY_KEY) private userRepository: IUserRepository,
    @Inject(USER_INFO_REPOSITORY_KEY) private userInfoRepository: IUserInfoRepository,
    @Inject(PROFILE_PHOTO_REPOSITORY_KEY) private profilePhotoRepository: IProfilePhotoRepository,
    private readonly levelCalculatorService: LevelCalculatorService
  ) {}

  @Transactional()
  async localSignUp(request: CreateLocalUserRequest): Promise<void> {
    const { email, password, nickname } = request;
    const saltRounds = Number(this.configService.get('SALT_ROUNDS'));

    await this.isExistEmail(email);
    await this.isExistNickname(nickname);
    try {
      const hashedPassword = await encryptValue(password, saltRounds);
      const newUser = User.createLocal(email, hashedPassword);
      newUser.updateUserInfo(UserInfo.create(nickname));
      newUser.updateProfilePhoto(ProfilePhoto.create());

      await this.userRepository.save(newUser);
    } catch (error) {
      throw new HttpException('회원가입에 실패하였습니다', HttpStatus.CONFLICT);
    }
  }

  @Transactional()
  async socialSignUp(request: CreateSocialUserRequest): Promise<User> {
    const { email, provider, providerId, nickname } = request;
    const uniqueNickname = await this.createUniqueNickname(nickname);
    try {
      const newSnsUser = User.createSocial(email, provider, providerId);
      newSnsUser.updateUserInfo(UserInfo.create(uniqueNickname));
      newSnsUser.updateProfilePhoto(ProfilePhoto.create());

      return await this.userRepository.save(newSnsUser);
    } catch (error) {
      throw new HttpException('회원가입에 실패하였습니다', HttpStatus.CONFLICT);
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  async deleteUserById(id: number): Promise<void> {
    const findUserById = await this.userRepository.findById(id);
    if (!findUserById) {
      throw new HttpException('해당 유저가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.delete(id);
  }

  async findUserById(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpException('해당 유저가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }
    const level = this.levelCalculatorService.findLevel(user.userInfo.point).level;
    return new UserResponse(user, level);
  }

  async updateUserInfoById(userId: number, updateUserRequest: UpdateUserRequest): Promise<void> {
    const { nickname, intro } = updateUserRequest;
    const userInfo = await this.userInfoRepository.findByUserId(userId);
    if (!userInfo) {
      throw new HttpException('해당 유저 정보가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }
    // 변경하려는 닉네임과 현재 사용자의 닉네임이 다른 경우에만 중복 확인
    if (userInfo.nickname !== nickname) {
      await this.isExistNickname(nickname);
    }
    userInfo.update(nickname, intro);
    await this.userInfoRepository.save(userInfo);
  }

  async updateProfilePhotoById(userId: number, request: UpdateProfilePhotoRequest): Promise<void> {
    const { profilePhotoUrl } = request;
    const profilePhoto = await this.profilePhotoRepository.findOneByUserId(userId);
    if (!profilePhoto) {
      throw new HttpException('해당 유저 정보가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }

    profilePhoto.update(profilePhotoUrl);
    await this.profilePhotoRepository.save(profilePhoto);
  }

  async isExistEmail(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new HttpException('이미 존재하는 회원입니다', HttpStatus.CONFLICT);
    }
  }

  async isExistNickname(nickname: string): Promise<void> {
    const existingNickname = await this.userInfoRepository.findByNickname(nickname);
    if (existingNickname) {
      throw new HttpException('닉네임이 이미 사용 중입니다', HttpStatus.CONFLICT);
    }
  }

  private async createUniqueNickname(nickname: string): Promise<string> {
    let uniqueId = uuidv4().split('-')[0];
    let uniqueNickname = `${nickname}#${uniqueId}`;
    while (await this.userInfoRepository.findByNickname(uniqueNickname)) {
      uniqueId = uuidv4().split('-')[0];
      uniqueNickname = `${nickname}#${uniqueId}`;
    }
    return uniqueNickname;
  }
}
