import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserInfo } from './entities/user-info.entity';
import { ProfilePhoto } from './entities/profile-photo.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserInfo) private userInfoRepository: Repository<UserInfo>,
    @InjectRepository(ProfilePhoto) private profielPhotoRepository: Repository<ProfilePhoto>
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const { email, password, nickname } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException('이미 존재하는 회원입니다', HttpStatus.CONFLICT);
    }
    const saltRounds = parseInt(this.configService.get<string>('SALT_ROUNDS'));
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = this.userRepository.create({ email, password: hashedPassword });
    const savedUser = await this.userRepository.save(user);

    const userInfo = this.userInfoRepository.create({ userId: savedUser.id, nickname });
    await this.userInfoRepository.save(userInfo);

    const profilePhoto = this.profielPhotoRepository.create({ userId: savedUser.id });
    await this.profielPhotoRepository.save(profilePhoto);
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userInfo', 'profilePhoto'],
    });
    if (!user) {
      throw new HttpException('fail - User not found', HttpStatus.NOT_FOUND);
    }
    return new UserResponseDto(user);
  }

  async updateUserInfoById(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const existingNickname = await this.userInfoRepository.existsBy({
      nickname: updateUserDto.nickname,
    });

    if (existingNickname) {
      throw new HttpException('닉네임이 이미 사용 중입니다', HttpStatus.CONFLICT);
    }

    const userInfo = await this.userInfoRepository.findOne({ where: { userId: id } });
    if (!userInfo) {
      throw new HttpException('fail - User not found', HttpStatus.NOT_FOUND);
    }
    const newUserInfo = this.userInfoRepository.merge(userInfo, updateUserDto);
    await this.userInfoRepository.save(newUserInfo);
  }

  async deleteUserById(id: number) {
    const findUserById = await this.userRepository.findOne({ where: { id } });
    if (!findUserById) {
      throw new HttpException('fail - User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.delete(id);
  }
}
