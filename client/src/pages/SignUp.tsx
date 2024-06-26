import Button from '@/components/Button';
import InputBox from '@/components/InputBox';
import NavigationText from '@/components/NavigationText';
import Title from '@/components/Title';
import { ROUTERS } from '@/constant/route';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useUser } from '@/hooks/useUser';

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
    <SignUpStyle>
      <Title text="InGame" />
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
        {/** 20240511 이메일 인증 코드 구현 미뤄짐 */}
        {/* <fieldset>
          <InputBox
            inputIconType="code"
            inputType="text"
            placeholder="인증코드"
            {...register('code', { required: true })}
          />
          {errors.code && errors.code.type === 'required' && (
            <p className="error-text">이메일 인증 코드를 입력해주세요</p>
          )}
        </fieldset> */}
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
      <NavigationText text="Sign In!" url={ROUTERS.AUTH.LOGIN} />
    </SignUpStyle>
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

export default SignUp;
