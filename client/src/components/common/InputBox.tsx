import React, { ForwardedRef, useState } from 'react';
import styled from 'styled-components';
import { MdOutlineEmail } from 'react-icons/md';
import { BsKey } from 'react-icons/bs';
import { FaRegSmile } from 'react-icons/fa';
import { IoEye, IoEyeOff } from 'react-icons/io5';

type endType = 'icon';
type inputIconType = 'nickname' | 'email' | 'password' | 'code';

interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholer?: string;
  inputType?: 'text' | 'email' | 'password' | 'number';
  inputIconType: inputIconType;
  $endType?: endType;
}

const InputBox = React.forwardRef(
  (
    { placeholer, inputType, inputIconType, $endType, ...props }: InputBoxProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [isEyeIcon, setIsEyeIcon] = useState(true);
    const [passwordType, setPasswordType] = useState(inputType);

    const toggleIcon = () => {
      setIsEyeIcon(!isEyeIcon);
      setPasswordType(passwordType === 'password' ? 'text' : 'password');
    };

    return (
      <InputBoxLayoutStyle>
        <InputIconSpan>
          {inputIconType === 'nickname' && <FaRegSmile />}
          {(inputIconType === 'email' || inputIconType === 'code') && <MdOutlineEmail />}
          {inputIconType === 'password' && <RotatedBsKey />}
        </InputIconSpan>
        <InputBoxStyle
          placeholder={placeholer}
          ref={ref}
          type={passwordType}
          {...props}
        ></InputBoxStyle>
        {$endType === 'icon' && (
          <InputEndIconSpan $endType={$endType} onClick={toggleIcon}>
            {$endType === 'icon' && (isEyeIcon ? <IoEye /> : <IoEyeOff />)}
          </InputEndIconSpan>
        )}
      </InputBoxLayoutStyle>
    );
  }
);

const InputBoxLayoutStyle = styled.div`
  border: 1px solid ${({ theme }) => theme.color.grayNormal};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 2.5rem;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15);
`;

const InputBoxStyle = styled.input`
  padding: 0.25rem 0.75rem;
  font-size: ${({ theme }) => theme.font.xsmall};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  flex-grow: 1;
  &::placeholder {
    color: ${({ theme }) => theme.color.grayNormal};
    font-family: 'Pretendard400';
  }
`;

const InputIconSpan = styled.span`
  width: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.grayDark};
  border-right: 1px solid ${({ theme }) => theme.color.grayNormal};
  height: inherit;
`;

const InputEndIconSpan = styled.span<Pick<InputBoxProps, '$endType'>>`
  width: 2.25rem;
  color: ${({ theme }) => theme.color.grayDark};
  display: flex;
  align-items: center;
  justify-content: center;
  height: inherit;

  &:hover {
    cursor: ${({ $endType }) => $endType && 'pointer'};
  }
`;

const RotatedBsKey = styled(BsKey)`
  transform: rotate(90deg);
`;

export default InputBox;
