import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserInfo } from './entities/user-info.entity';
import { ProfilePhoto } from './entities/profile-photo.entity';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserInfo) private userInfoRepository: Repository<UserInfo>,
    @InjectRepository(ProfilePhoto) private profielPhotoRepository: Repository<ProfilePhoto>
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const { email, password, nickname } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const user = this.userRepository.create({ email, password });
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
      throw new HttpException('사용자가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }
    return new UserResponseDto(user);
  }

  async updateUserInfoById(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const existingNickname = await this.userInfoRepository.existsBy({
      nickname: updateUserDto.nickname,
    });

    if (existingNickname) {
      throw new HttpException('닉네임이 이미 사용 중입니다.', HttpStatus.CONFLICT);
    }

    const userInfo = await this.userInfoRepository.findOne({ where: { userId: id } });
    if (!userInfo) {
      throw new HttpException('사용자가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }
    const newUserInfo = this.userInfoRepository.merge(userInfo, updateUserDto);
    await this.userInfoRepository.save(newUserInfo);
  }

  async deleteUserById(id: number) {
    const findUserById = await this.userRepository.findOne({ where: { id } });
    if (!findUserById) {
      throw new HttpException('사용자가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.delete(id);
  }
}
