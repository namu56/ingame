import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserInfo } from './entities/user-info.entity';
import { ProfilePhoto } from './entities/profile-photo.entity';
import { UserProfileDto } from './dto/user-profile.dto';
import { ConfigService } from '@nestjs/config';
import { ProfilePhotoDto } from './dto/profile-photo.dto';
import { LevelCalculatorService } from 'src/common/level-calculator/level-calculator.service';
import { hashPassword } from 'src/common/utils/hash-password.util';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserInfo) private userInfoRepository: Repository<UserInfo>,
    @InjectRepository(ProfilePhoto) private profilePhotoRepository: Repository<ProfilePhoto>,
    private levelCalculatorService: LevelCalculatorService
  ) {}
  async signUp(createUserDto: CreateUserDto, queryRunnerManager: EntityManager) {
    const { email, password, nickname } = createUserDto;

    try {
      await this.checkUser(email);
      await this.checkNickname(nickname);

      const newUser = await this.createUser(email, password, queryRunnerManager);
      await this.createUserInfo(newUser.id, nickname, queryRunnerManager);
      await this.createProfilePhoto(newUser.id, queryRunnerManager);
    } catch (err) {
      throw err;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new HttpException('Fail - User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async deleteCurrentUserById(id: number) {
    const findUserById = await this.userRepository.findOne({ where: { id } });
    if (!findUserById) {
      throw new HttpException('fail - User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.delete(id);
  }

  async getUserById(id: number): Promise<UserProfileDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userInfo', 'profilePhoto'],
    });
    if (!user) {
      throw new HttpException('fail - User not found', HttpStatus.NOT_FOUND);
    }

    return this.toUserResponse(user);
  }

  async updateCurrenUserInfoById(userId: number, updateUserDto: UpdateUserDto): Promise<void> {
    const userInfo = await this.userInfoRepository.findOne({ where: { userId } });
    if (!userInfo) {
      throw new HttpException('fail - User not found', HttpStatus.NOT_FOUND);
    }
    // 변경하려는 닉네임과 현재 사용자의 닉네임이 다른 경우에만 중복 확인
    if (userInfo.nickname !== updateUserDto.nickname) {
      await this.checkNickname(updateUserDto.nickname);
    }
    const newUserInfo = this.userInfoRepository.merge(userInfo, updateUserDto);
    await this.userInfoRepository.save(newUserInfo);
  }

  async updateProfilePhotoById(userId: number, profilePhotoDto: ProfilePhotoDto) {
    const findProfilePhotoById = await this.profilePhotoRepository.findOne({
      where: { userId },
    });
    if (!findProfilePhotoById) {
      throw new HttpException('Fail - User not found', HttpStatus.NOT_FOUND);
    }

    const newProfilePhoto = this.profilePhotoRepository.merge(
      findProfilePhotoById,
      profilePhotoDto
    );
    await this.profilePhotoRepository.save(newProfilePhoto);
  }

  async getAllUserByPage(page: number, limit: number): Promise<[UserInfo[], number]> {
    const offset = (page - 1) * limit;
    const [users, total] = await this.userInfoRepository.findAndCount({
      order: { point: 'DESC' },
      skip: offset,
      take: limit,
    });
    return [users, total];
  }

  private toUserResponse(user: User): UserProfileDto {
    const level = this.levelCalculatorService.findLevel(user.userInfo.point).level;

    return {
      id: user.id,
      email: user.email,
      nickname: user.userInfo.nickname,
      intro: user.userInfo.intro ?? null,
      profilePhoto: user.profilePhoto.profilePhoto ?? null,
      point: user.userInfo.point,
      level,
    };
  }

  async checkUser(email: string): Promise<void> {
    const existingUser = await this.userRepository.existsBy({ email });
    if (existingUser) {
      throw new HttpException('이미 존재하는 회원입니다', HttpStatus.CONFLICT);
    }
  }

  async checkNickname(nickname: string): Promise<void> {
    const existingNickname = await this.userInfoRepository.existsBy({ nickname });
    if (existingNickname) {
      throw new HttpException('닉네임이 이미 사용 중입니다', HttpStatus.CONFLICT);
    }
  }

  private async createUser(
    email: string,
    password: string,
    queryRunnerManager: EntityManager
  ): Promise<User> {
    const saltRounds = parseInt(this.configService.get<string>('SALT_ROUNDS'));
    const hashedPassword = await hashPassword(password, saltRounds);
    const user = this.userRepository.create({ email, password: hashedPassword });

    return await queryRunnerManager.save(user);
  }

  private async createUserInfo(
    userId: number,
    nickname: string,
    queryRunnerManager: EntityManager
  ): Promise<void> {
    const userInfo = this.userInfoRepository.create({ userId, nickname });
    await queryRunnerManager.save(userInfo);
  }

  private async createProfilePhoto(
    userId: number,
    queryRunnerManager: EntityManager
  ): Promise<void> {
    const profilePhoto = this.profilePhotoRepository.create({ userId });
    await queryRunnerManager.save(profilePhoto);
  }
}
