import { login, logout } from '@/api/auth.api';
import { ROUTERS } from '@/constant/route';
import { LoginProps } from '@/pages/Login';
import { storeLogout } from '@/store/authSlice';
import { removeToken, setToken } from '@/utils/tokenUtils';
import { useMutation } from '@tanstack/react-query';
import { error } from 'console';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = (data: LoginProps) => {
    loginMutation.mutate(data);
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess(res) {
      setToken(res.accessToken);
      alert('로그인 성공');
      navigate(ROUTERS.MAIN);
    },
    onError(err) {
      alert('로그인 실패');
    },
  });

  const userLogout = () => {
    logoutMutation.mutate();
  };

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess(res) {
      alert('로그아웃 성공');
      removeToken();
      navigate(ROUTERS.AUTH.LOGIN);
    },
    onError(err) {
      alert('로그아웃 실패');
    },
  });

  return { userLogin, userLogout };
};
