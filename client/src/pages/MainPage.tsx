import styled from 'styled-components';
import React from 'react';
import InputBox from '@/components/InputBox';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';

const MainPage = () => {
  const useform = useForm();
  const { register, handleSubmit, watch } = useform;
  return (
    <MainPageStyle>
      <h1>MainPage</h1>
      <form>
        <InputBox inputType="email" $endType="text" placeholder="이메일" {...register('email')} />
        <InputBox inputType="text" placeholder="닉네임" />
        <InputBox inputType="password" $endType="icon" placeholder="비밀번호" />
        <InputBox inputType="password" $endType="icon" placeholder="비밀번호 확인" />
      </form>
      <Button size="medium" color="blue" children={'회원가입'} />
    </MainPageStyle>
  );
};

const MainPageStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 30px;

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

export default MainPage;
