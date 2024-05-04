import { login } from '@/api/auth.api';
import { ROUTERS } from '@/constant/route';
import { LoginProps } from '@/pages/Login';
import { storeLogin } from '@/store/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = (data: LoginProps) => {
    login(data).then(
      (res) => {
        //상태 변화
        dispatch(storeLogin({ token: res.accessToken }));
        alert('로그인 성공');
        navigate(ROUTERS.MAIN);
      },
      (error) => {
        alert('로그인 실패');
      }
    );
  };

  return { userLogin };
};
