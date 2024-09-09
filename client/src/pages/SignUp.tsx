import Button from '@/components/common/Button';
import InputBox from '@/components/common/InputBox';
import NavigationText from '@/components/common/NavigationText';
import Title from '@/components/common/Title';
import { ROUTERS } from '@/constant/route';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useUser } from '@/hooks/useUser';
import Header from '@/components/common/Header';

export interface SignupProps {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  code: string;
}

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupProps>();

  const { userSignup } = useUser();

  const onSubmit = (formData: SignupProps) => {
    const { confirmPassword, code, ...data } = formData;
    userSignup(data);
  };

  return (
    <>
      <Header title="InGame" />
      <SignUpStyle>
        <Title text="회원가입" size="large" color="blue" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <div className="sendEmail">
              <InputBox
                inputIconType="email"
                inputType="email"
                placeholder="이메일"
                {...register('email', { required: true, maxLength: 50 })}
              />
              {/** 20240511 이메일 인증 코드 구현 미뤄짐 */}
              {/* <button className="sendEmailBtn">인증하기</button> */}
            </div>
            {errors.email && errors.email.type === 'required' && (
              <p className="error-text">이메일을 입력해주세요</p>
            )}
            {errors.email && errors.email.type === 'maxLength' && (
              <p className="error-text">이메일은 최대 50글자입니다</p>
            )}
          </fieldset>
          <fieldset>
            <InputBox
              inputIconType="nickname"
              inputType="text"
              placeholder="닉네임"
              {...register('nickname', { required: true, maxLength: 50 })}
            />
            {errors.nickname && errors.nickname.type === 'required' && (
              <p className="error-text">닉네임을 입력해주세요</p>
            )}
            {errors.nickname && errors.nickname.type === 'maxLength' && (
              <p className="error-text">닉네임은 최대 50글자입니다</p>
            )}
          </fieldset>
          <fieldset>
            <InputBox
              inputIconType="password"
              inputType="password"
              placeholder="비밀번호"
              $endType="icon"
              {...register('password', { required: true, maxLength: 30, minLength: 8 })}
            />
            {errors.password && errors.password.type === 'required' && (
              <p className="error-text">비밀번호를 입력해주세요</p>
            )}
            {errors.password && errors.password.type === 'maxLength' && (
              <p className="error-text">비밀번호는 최대 30자리입니다</p>
            )}
            {errors.password && errors.password.type === 'minLength' && (
              <p className="error-text">비밀번호는 최소 8자리입니다</p>
            )}
          </fieldset>
          <fieldset>
            <InputBox
              inputIconType="password"
              inputType="password"
              placeholder="비밀번호"
              $endType="icon"
              {...register('confirmPassword', {
                required: true,
                validate: (val: string) => {
                  if (watch('password') !== val) {
                    return '입력한 비밀번호가 일치하지 않습니다';
                  }
                },
              })}
            />
            {errors.confirmPassword && errors.confirmPassword.type === 'required' && (
              <p className="error-text">비밀번호를 입력해주세요</p>
            )}
            {errors.confirmPassword && errors.confirmPassword.type === 'validate' && (
              <p className="error-text">{errors.confirmPassword.message}</p>
            )}
          </fieldset>
          <Button type="submit" size="medium" color="blue" children={'회원가입'} />
        </form>
        <LoginLink>
          <span>이미 가입하셨나요?</span>
          <NavigationText text="로그인하기" url={ROUTERS.AUTH.LOGIN} />
        </LoginLink>
      </SignUpStyle>
    </>
  );
};

const SignUpStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 30px;
  justify-content: center;
  height: 100vh;
  transform: translateY(-5%);

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .error-text {
      color: ${({ theme }) => theme.color.red};
      margin-top: 5px;
      font-size: 13px;
    }

    .sendEmail {
      position: relative;

      .sendEmailBtn {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: ${({ theme }) => theme.font.xsmall};
        background: none;
        color: ${({ theme }) => theme.color.purple};
      }
    }
  }
`;

const LoginLink = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -20px;
  gap: 5px;
  font-size: ${({ theme }) => theme.font.xsmall};
  color: ${({ theme }) => theme.color.grayDark};
`;

export default SignUp;
