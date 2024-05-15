import { patchUserProfilePhoto } from '@/api/users.api';
import { ProfilePhoto } from '@/models/user.model';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { USER } from '@/constant/queryKey';

export const useChangeProfilePhotoMutation = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ['USER', 'PROFILE_PHOTO'],
    mutationFn: (data: ProfilePhoto) => patchUserProfilePhoto({ ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...USER.GET_USERINFO],
      });
    },
  });
  return { mutate };
};
