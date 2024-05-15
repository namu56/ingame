import { patchUserProfilePhoto } from '@/api/users.api';
import { ProfilePhoto } from '@/models/user.model';
import { useMutation } from '@tanstack/react-query';

export const useChangeProfilePhotoMutation = () => {
  const { mutate } = useMutation({
    mutationKey: ['USER', 'PROFILE_PHOTO'],
    mutationFn: (data: ProfilePhoto) => patchUserProfilePhoto({ ...data }),
    onSuccess: () => {},
  });
  return { mutate };
};
