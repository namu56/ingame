import { IGenericRepository } from 'src/core/database/generic/generic.repository';
import { ProfilePhoto } from './profile-photo.entity';

export const PROFILE_PHOTO_REPOSITORY_KEY = 'PROFILE_PHOTO_REPOSITORY_KEY';

export interface IProfilePhotoRepository extends IGenericRepository<ProfilePhoto> {
  findOneByUserId(userId: number): Promise<ProfilePhoto | null>;
  updateByUserId(
    profilePhoto: ProfilePhoto,
    updateData: Partial<ProfilePhoto>
  ): Promise<ProfilePhoto>;
}
