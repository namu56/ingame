import Button from '@/components/Button';
import InputBox from '@/components/InputBox';
import NavigationText from '@/components/NavigationText';
import Title from '@/components/Title';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { ROUTERS } from '@/constant/route';

export interface LoginProps {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>();

  const onSubmit = (data: LoginProps) => {
    // userLogin(data);
    console.log(data);
  };

  return (
    <LoginStyle>
      <Title text="InGame" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <InputBox
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
            inputType="password"
            placeholder="비밀번호"
            {...register('password', { required: true, maxLength: 100 })}
          />
          {errors.password && errors.password.type === 'required' && (
            <p className="error-text">비밀번호를 확인해주세요</p>
          )}
          {errors.password && errors.password.type === 'maxLength' && (
            <p className="error-text">비밀번호는 최대 100글자입니다</p>
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
