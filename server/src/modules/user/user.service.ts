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
  CreateLocalUserRequest,
  CreateSocialUserRequest,
  UpdateProfilePhotoRequest,
  UpdateUserRequest,
} from 'src/common/requests/user';
import { UserResponse } from 'src/common/responses/user';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_REPOSITORY_KEY) private userRepository: IUserRepository,
    @Inject(USER_INFO_REPOSITORY_KEY) private userInfoRepository: IUserInfoRepository,
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
      const newUserInfo = UserInfo.create(nickname);

      newUserInfo.user = newUser;

      await this.userRepository.save(newUser);
      await this.userInfoRepository.save(newUserInfo);
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
      const newUserInfo = UserInfo.create(uniqueNickname);

      newUserInfo.user = newSnsUser;

      const savedUser = await this.userRepository.save(newSnsUser);
      await this.userInfoRepository.save(newUserInfo);

      return savedUser;
    } catch (error) {
      throw new HttpException('회원가입에 실패하였습니다', HttpStatus.CONFLICT);
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  async deleteUserById(id: number): Promise<void> {
    await this.getUserById(id);
    await this.userRepository.delete(id);
  }

  async getUserResposeById(id: number): Promise<UserResponse> {
    const user = await this.getUserById(id);
    const level = this.levelCalculatorService.findLevel(user.userInfo.point).level;
    const levelProgress = this.levelCalculatorService.calculateLevelProgress(user.userInfo.point);

    return plainToInstance(UserResponse, { ...user, level, levelProgress });
  }

  async updateUserInfoById(userId: number, request: UpdateUserRequest): Promise<void> {
    const { nickname, intro } = request;
    const userInfo = await this.getUserInfoByUserId(userId);

    // 변경하려는 닉네임과 현재 사용자의 닉네임이 다른 경우에만 중복 확인
    if (userInfo.nickname !== nickname) {
      await this.isExistNickname(nickname);
    }
    userInfo.update(nickname, intro);
    await this.userInfoRepository.save(userInfo);
  }

  async updateProfilePhotoById(userId: number, request: UpdateProfilePhotoRequest): Promise<void> {
    const { profilePhoto } = request;
    const userInfo = await this.getUserInfoByUserId(userId);
    if (!userInfo) {
      throw new HttpException('해당 유저 정보가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }

    userInfo.updateProfilePhoto(profilePhoto);
    await this.userInfoRepository.save(userInfo);
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

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new HttpException('해당 유저가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUserInfoByUserId(userId: number): Promise<UserInfo> {
    const userInfo = await this.userInfoRepository.findByUserId(userId);
    if (!userInfo) {
      throw new HttpException('해당 유저 정보가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }
    return userInfo;
  }
}
