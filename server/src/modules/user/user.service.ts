import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../common/dto/user/create-user.dto';
import { UpdateUserDto } from '../../common/dto/user/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserInfo } from '../../entities/user-info/user-info.entity';
import { ProfilePhoto } from '../../entities/profile-photo/profile-photo.entity';
import { UserProfileDto } from '../../common/dto/user/user-profile.dto';
import { ConfigService } from '@nestjs/config';
import { ProfilePhotoDto } from '../../common/dto/user/profile-photo.dto';
import { LevelCalculatorService } from 'src/core/level-calculator/level-calculator.service';
import { CreateSnsUserDto } from '../../common/dto/user/create-sns-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { Transactional } from 'src/core/decorators/transactional.decorator';
import { TransactionManager } from 'src/common/utils/transaction-manager.util';
import { encryptValue } from 'src/common/utils/encrypt-value.util';
import { UserInfoWithRankDto } from '../../common/dto/ranking/user-info-with-rank.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserInfo) private userInfoRepository: Repository<UserInfo>,
    @InjectRepository(ProfilePhoto) private profilePhotoRepository: Repository<ProfilePhoto>,
    private readonly transactionManager: TransactionManager,
    private levelCalculatorService: LevelCalculatorService
  ) {}

  @Transactional()
  async signUp(createUserDto: CreateUserDto): Promise<void> {
    const { email, password, nickname } = createUserDto;
    const transactionalEntityManager = this.transactionManager.getEntityManager();

    try {
      await this.isExistUser(email);
      await this.isExistNickname(nickname);

      const newUser = await this.createLocalUser(email, password, transactionalEntityManager);
      await this.createUserInfo(newUser.id, nickname, transactionalEntityManager);
      await this.createProfilePhoto(newUser.id, transactionalEntityManager);
    } catch (err) {
      throw err;
    }
  }

  @Transactional()
  async socialSignUp(createSnsUserDto: CreateSnsUserDto): Promise<User> {
    const { email, provider, providerId, nickname } = createSnsUserDto;
    const transactionalEntityManager = this.transactionManager.getEntityManager();
    try {
      const uniqueNickname = await this.createUniqueNickname(nickname);
      const newSnsUser = await this.createSnsUser(
        email,
        provider,
        providerId,
        transactionalEntityManager
      );
      await this.createUserInfo(newSnsUser.id, uniqueNickname, transactionalEntityManager);
      await this.createProfilePhoto(newSnsUser.id, transactionalEntityManager);

      return newSnsUser;
    } catch (err) {
      throw err;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
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
      await this.isExistNickname(updateUserDto.nickname);
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

  async isExistUser(email: string): Promise<void> {
    const existingUser = await this.userRepository.existsBy({ email });
    if (existingUser) {
      throw new HttpException('이미 존재하는 회원입니다', HttpStatus.CONFLICT);
    }
  }

  async isExistNickname(nickname: string): Promise<void> {
    const existingNickname = await this.userInfoRepository.existsBy({ nickname });
    if (existingNickname) {
      throw new HttpException('닉네임이 이미 사용 중입니다', HttpStatus.CONFLICT);
    }
  }

  private async createLocalUser(
    email: string,
    password: string,
    transactionalEntityManager: EntityManager
  ): Promise<User> {
    const saltRounds = parseInt(this.configService.get<string>('SALT_ROUNDS'));
    const hashedPassword = await encryptValue(password, saltRounds);
    const user = this.userRepository.create({ email, password: hashedPassword });

    return await transactionalEntityManager.save(user);
  }

  private async createSnsUser(
    email: string,
    provider: string,
    providerId: string,
    transactionalEntityManager: EntityManager
  ) {
    const user = this.userRepository.create({ email, provider, providerId });

    return transactionalEntityManager.save(user);
  }

  private async createUniqueNickname(nickname: string): Promise<string> {
    let uniqueId = uuidv4().split('-')[0];
    let uniqueNickname = `${nickname}#${uniqueId}`;
    while (await this.userInfoRepository.existsBy({ nickname: uniqueNickname })) {
      uniqueId = uuidv4().split('-')[0];
      uniqueNickname = `${nickname}#${uniqueId}`;
    }
    return uniqueNickname;
  }

  private async createUserInfo(
    userId: number,
    nickname: string,
    transactionalEntityManager: EntityManager
  ): Promise<void> {
    const userInfo = this.userInfoRepository.create({ userId, nickname });
    await transactionalEntityManager.save(userInfo);
  }

  private async createProfilePhoto(
    userId: number,
    transactionalEntityManager: EntityManager
  ): Promise<void> {
    const profilePhoto = this.profilePhotoRepository.create({ userId });
    await transactionalEntityManager.save(profilePhoto);
  }

  async getUsersWithRankByPage(
    page: number,
    limit: number
  ): Promise<[UserInfoWithRankDto[], number]> {
    const offset = (page - 1) * limit;

    const usersInfo: UserInfoWithRankDto[] = await this.userInfoRepository
      .createQueryBuilder('userInfo')
      .select('userInfo.id', 'id')
      .addSelect('userInfo.nickname', 'nickname')
      .addSelect('userInfo.point', 'point')
      .addSelect('RANK() OVER (ORDER BY userInfo.point DESC)', 'rank')
      .orderBy('userInfo.point', 'DESC')
      .limit(limit)
      .offset(offset)
      .getRawMany();

    const total = await this.userInfoRepository.createQueryBuilder('userInfo').getCount();

    return [usersInfo, total];
  }
}
