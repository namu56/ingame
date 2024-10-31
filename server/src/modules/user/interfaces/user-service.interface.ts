import { UserInfo } from '@entities/user-info/user-info.entity';
import {
  CreateLocalUserRequest,
  CreateSocialUserRequest,
  UpdateProfilePhotoRequest,
  UpdateUserRequest,
} from 'src/common/requests/user';
import { UserResponse } from 'src/common/responses/user';
import { User } from 'src/entities/user/user.entity';

export const USER_SERVICE_KEY = 'userServiceKey';

export interface IUserService {
  localSignUp(createLocalUserRequest: CreateLocalUserRequest): Promise<void>;
  socialSignUp(createSocialUserRequest: CreateSocialUserRequest): Promise<User>;
  getUserResposeById(id: number): Promise<UserResponse>;
  findUserByEmail(email: string): Promise<User | null>;
  deleteUserById(id: number): Promise<void>;
  updateUserInfoById(userId: number, updateUserRequest: UpdateUserRequest): Promise<void>;
  updateProfilePhotoById(
    userId: number,
    updateProfilePhotoRequest: UpdateProfilePhotoRequest
  ): Promise<void>;
  isExistEmail(email: string): Promise<void>;
  isExistNickname(nickname: string): Promise<void>;
  getUserById(id: number): Promise<User>;
  getUserInfoByUserId(userId: number): Promise<UserInfo>;
}
