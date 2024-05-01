import Button from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import InputBox from '@/components/InputBox';
import styled from 'styled-components';

import { useForm } from 'react-hook-form';
import { RxHamburgerMenu } from 'react-icons/rx';

const Test = () => {
  const useform = useForm();
  const { register, handleSubmit, watch } = useform;
  return (
    <TestStyle>
      <h1>Test</h1>
      <form>
        <InputBox inputType="email" $endType="text" placeholder="이메일" {...register('email')} />
        <InputBox inputType="text" placeholder="닉네임" />
        <InputBox inputType="password" $endType="icon" placeholder="비밀번호" />
        <InputBox inputType="password" $endType="icon" placeholder="비밀번호 확인" />
      </form>
      <Button size="medium" color="blue" children={'회원가입'} />
      <Dropdown toggleButton={<RxHamburgerMenu />}>
        {
          <ul>
            <li>
              <div>드롭박스 내용</div>
            </li>
            <li>
              <div>드롭박스 내용</div>
            </li>
            <li>
              <div>드롭박스 내용</div>
            </li>
          </ul>
        }
      </Dropdown>
    </TestStyle>
  );
};

const TestStyle = styled.div`
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

export default Test;
