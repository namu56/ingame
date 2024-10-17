import { getUserInfo } from '@/api/users.api';
import { USER } from '@/constant/queryKey';
import { UserInfo } from '@/models/userInfo.model';
import { useQuery } from '@tanstack/react-query';

export const useUserInfo = () => {
  const { data: userInfo, refetch } = useQuery<UserInfo>({
    queryKey: [...USER.GET_USERINFO],
    queryFn: () => getUserInfo(),
  });

  return { userInfo, refetch };
};
