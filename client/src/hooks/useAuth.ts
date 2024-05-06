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
    login(data).then(
      (res) => {
        //상태 변화
        setToken(res.accessToken);
        alert('로그인 성공');
        navigate(ROUTERS.MAIN);
      },
      (error) => {
        console.log(error);
        alert('로그인 실패');
      }
    );
  };

  const userLogout = () => {
    logout().then(
      (res) => {
        alert('로그아웃 성공');
        removeToken();
        navigate(ROUTERS.AUTH.LOGIN);
      },
      (error) => {
        console.log(error);
        alert('로그아웃 실패');
      }
    );
  };

  return { userLogin, userLogout };
};
