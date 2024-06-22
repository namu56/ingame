import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { ProfilePhoto } from './profile-photo.entity';
import { IProfilePhotoRepository } from './profile-photo-repository.interface';
import { EntityTarget } from 'typeorm';

export class ProfilePhotoRepository
  extends GenericTypeOrmRepository<ProfilePhoto>
  implements IProfilePhotoRepository
{
  getName(): EntityTarget<ProfilePhoto> {
    return ProfilePhoto.name;
  }

  async findOneByUserId(userId: number): Promise<ProfilePhoto> {
    return this.getRepository().findOneBy({ userId });
  }

  async updateByUserId(
    profilePhoto: ProfilePhoto,
    updateData: Partial<ProfilePhoto>
  ): Promise<ProfilePhoto> {
    return this.getRepository().merge(profilePhoto, updateData);
  }
}
