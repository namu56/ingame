import { deleteUser, signup } from '@/api/users.api';
import { ROUTERS } from '@/constant/route';
import { SignupProps } from '@/pages/SignUp';
import { useNavigate } from 'react-router-dom';
import { useMessage } from './useMessage';
import { getToken, removeToken } from '@/utils/tokenUtils';
import { useMutation } from '@tanstack/react-query';

export const useUser = () => {
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useMessage();

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

  const userDelete = () => {
    showConfirm('정말로 회원 탈퇴하시겠습니까?', () => {
      const token = getToken();
      if (token) {
        userDeleteMutation.mutate();
      } else {
        showAlert('로그인이 필요합니다.');
        navigate(ROUTERS.AUTH.LOGIN);
      }
    });
  };

  const userDeleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess(res) {
      showAlert('회원 탈퇴 성공');
      removeToken();
      navigate(ROUTERS.AUTH.LOGIN);
    },
    onError(err) {
      showAlert('회원 탈퇴 실패');
    },
  });

  return { userSignup, userDelete };
};
