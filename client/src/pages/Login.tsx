import Button from '@/components/common/Button';
import InputBox from '@/components/common/InputBox';
import NavigationText from '@/components/common/NavigationText';
import Title from '@/components/common/Title';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { ROUTERS } from '@/constant/route';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/common/Header';
import GoogleIcon from '@/assets/images/google-icon.png';
import KakaoIcon from '@/assets/images/kakao-icon.png';
import NaverIcon from '@/assets/images/naver-icon.png';

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
      <Header title="InGame" />
      <LocalLoginContainer>
        <LoginHeader>
          <Title text="로그인" size="large" />
        </LoginHeader>
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
        <SignUpLink>
          <span>계정이 없으신가요?</span>
          <NavigationText text="가입하기" url={ROUTERS.AUTH.SIGNUP} />
        </SignUpLink>
      </LocalLoginContainer>
      <SocialLoginContainer>
        <SocialButton>
          <img src={GoogleIcon} alt="Google" />
          구글로 계속하기
        </SocialButton>
        <SocialButton>
          <img src={KakaoIcon} alt="Kakao" />
          카카오로 계속하기
        </SocialButton>
        <SocialButton>
          <img src={NaverIcon} alt="Naver" />
          네이버로 계속하기
        </SocialButton>
      </SocialLoginContainer>
    </LoginStyle>
  );
};

const LoginStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  gap: 40px;
`;

const LocalLoginContainer = styled.div`
  display: flex;
  flex-direction: column;

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .error-text {
      color: ${({ theme }) => theme.color.red};
      margin-top: 5px;
      font-size: 13px;
    }

    &:hover {
      background-color: ${({ theme }) => theme.color};
    }

    & > Button {
      margin-bottom: 10px;
    }
  }
`;

const LoginHeader = styled.div`
  margin-bottom: 30px;
`;

const SignUpLink = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  font-size: ${({ theme }) => theme.font.xsmall};
  color: ${({ theme }) => theme.color.grayDark};
`;

const SocialLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.color.grayNormal};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.color.white};
  cursor: pointer;
  font-size: ${({ theme }) => theme.font.xsmall};
  gap: 10px;

  img {
    width: ${({ theme }) => theme.font.medium};
    height: ${({ theme }) => theme.font.medium};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colorActive.grayLight};
  }
`;

export default Login;
