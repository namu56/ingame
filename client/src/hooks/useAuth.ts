import { login, logout } from '@/api/auth.api';
import { ROUTERS } from '@/constant/route';
import { LoginProps } from '@/pages/Login';
import { removeToken, setToken } from '@/utils/tokenUtils';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useMessage } from './useMessage';

export const useAuth = () => {
  const navigate = useNavigate();
  const { showAlert } = useMessage();

  const userLogin = (data: LoginProps) => {
    loginMutation.mutate(data);
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess(res) {
      setToken(res);
      showAlert('로그인 성공');
      navigate(ROUTERS.MAIN);
    },
    onError(err) {
      showAlert('로그인 실패');
    },
  });

  const userLogout = () => {
    logoutMutation.mutate();
  };

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess(res) {
      showAlert('로그아웃 성공');
      removeToken();
      navigate(ROUTERS.AUTH.LOGIN);
    },
    onError(err) {
      showAlert('로그아웃 실패');
    },
  });

  return { userLogin, userLogout };
};
