import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { UserInfo } from './entities/user-info.entity';
import { ProfilePhoto } from './entities/profile-photo.entity';
import { UserProfileDto } from './dto/user-profile.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ProfilePhotoDto } from './dto/profile-photo.dto';
import { LevelCalculatorService } from 'src/common/level-calculator/level-calculator.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserInfo) private userInfoRepository: Repository<UserInfo>,
    @InjectRepository(ProfilePhoto) private profilePhotoRepository: Repository<ProfilePhoto>,
    private readonly dataSource: DataSource,
    private levelCalculatorService: LevelCalculatorService
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const { email, password, nickname } = createUserDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingEmail = await this.userRepository.existsBy({ email });
      if (existingEmail) {
        throw new HttpException('이미 존재하는 회원입니다', HttpStatus.CONFLICT);
      }

      const existingNickname = await this.userInfoRepository.existsBy({ nickname });
      if (existingNickname) {
        throw new HttpException('닉네임이 이미 사용 중입니다', HttpStatus.CONFLICT);
      }

      const saltRounds = parseInt(this.configService.get<string>('SALT_ROUNDS'));
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({ email, password: hashedPassword });
      const savedUser = await queryRunner.manager.save(user);

      const userInfo = this.userInfoRepository.create({ userId: savedUser.id, nickname });
      await queryRunner.manager.save(userInfo);

      const profilePhoto = this.profilePhotoRepository.create({ userId: savedUser.id });
      await queryRunner.manager.save(profilePhoto);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
      const existingNickname = await this.userInfoRepository.existsBy({
        nickname: updateUserDto.nickname,
      });
      if (existingNickname) {
        throw new HttpException('닉네임이 이미 사용 중입니다', HttpStatus.CONFLICT);
      }
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

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new HttpException('Fail - User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getAllUser(): Promise<UserInfo[]> {
    const users = await this.userInfoRepository.find({
      order: {
        point: 'DESC',
      },
    });
    return users;
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
}
