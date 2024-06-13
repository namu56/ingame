import Button from '@/components/common/Button';
import InputBox from '@/components/common/InputBox';
import NavigationText from '@/components/common/NavigationText';
import Title from '@/components/common/Title';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { ROUTERS } from '@/constant/route';
import { useAuth } from '@/hooks/useAuth';

export interface LoginProps {
  email: string;
  password: string;
}

const Login = () => {
  const { userLogin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>();

  const onSubmit = (data: LoginProps) => {
    userLogin(data);
  };

  return (
    <LoginStyle>
      <Title text="InGame" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <InputBox
            inputIconType="email"
            inputType="email"
            placeholder="이메일"
            {...register('email', { required: true, maxLength: 50 })}
          />
          {errors.email && errors.email.type === 'required' && (
            <p className="error-text">이메일을 입력해주세요</p>
          )}
          {errors.email && errors.email.type === 'maxLength' && (
            <p className="error-text">이메일은 최대 50글자입니다</p>
          )}
        </fieldset>
        <fieldset>
          <InputBox
            inputIconType="password"
            inputType="password"
            placeholder="비밀번호"
            {...register('password', { required: true, maxLength: 30, minLength: 8 })}
          />
          {errors.password && errors.password.type === 'required' && (
            <p className="error-text">비밀번호를 확인해주세요</p>
          )}
          {errors.password && errors.password.type === 'maxLength' && (
            <p className="error-text">비밀번호는 최대 30자리입니다</p>
          )}
          {errors.password && errors.password.type === 'minLength' && (
            <p className="error-text">비밀번호는 최소 8자리입니다</p>
          )}
        </fieldset>
        <Button type="submit" size="medium" color="blue" children={'로그인'} />
      </form>
      <NavigationText text="Sign Up!" url={ROUTERS.AUTH.SIGNUP} />
    </LoginStyle>
  );
};

const LoginStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 30px;
  justify-content: center;
  height: 100vh;
  transform: translateY(-10%);

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .error-text {
      color: ${({ theme }) => theme.color.red};
      margin-top: 5px;
      font-size: 13px;
    }
  }
`;

export default Login;
