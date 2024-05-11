import { signup } from '@/api/users.api';
import { ROUTERS } from '@/constant/route';
import { SignupProps } from '@/pages/SignUp';
import { useNavigate } from 'react-router-dom';

export const useUser = () => {
  const navigate = useNavigate();

  const userSignup = (data: Omit<SignupProps, 'confirmPassword' | 'code'>) => {
    signup(data).then(
      (res) => {
        alert('회원가입 성공');
        navigate(ROUTERS.AUTH.LOGIN);
      },
      (error) => {
        alert('회원가입 실패');
      }
    );
  };

  return { userSignup };
};
