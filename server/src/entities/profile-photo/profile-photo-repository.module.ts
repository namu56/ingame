import { ClassProvider, Module } from '@nestjs/common';
import { PROFILE_PHOTO_REPOSITORY_KEY } from './profile-photo-repository.interface';
import { ProfilePhotoRepository } from './profile-photo.repository';

export const profilePhotoRepository: ClassProvider = {
  provide: PROFILE_PHOTO_REPOSITORY_KEY,
  useClass: ProfilePhotoRepository,
};

@Module({
  providers: [profilePhotoRepository],
  exports: [profilePhotoRepository],
})
export class ProfilePhotoRepositoryModule {}
