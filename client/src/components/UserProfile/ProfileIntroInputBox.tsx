import React, { ForwardedRef } from 'react';
import styled from 'styled-components';

interface ProfileIntroInputBoxProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
  inputCount?: number;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ProfileIntroInputBox = React.forwardRef(
  (
    { placeholder, inputCount, onChange, ...props }: ProfileIntroInputBoxProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    return (
      <ProfileIntroInputBoxLayoutStyle>
        <ProfileIntroInputBoxStyle
          placeholder={placeholder}
          ref={ref}
          {...props}
          maxLength={50}
          onChange={onChange}
        />
        <p className="textLength">
          <span>{inputCount}</span>
          <span> / 50 자</span>
        </p>
      </ProfileIntroInputBoxLayoutStyle>
    );
  }
);

const ProfileIntroInputBoxLayoutStyle = styled.div`
  display: flex;
  align-items: flex-start;

  width: 100%;
  height: 216px;
  background: ${({ theme }) => theme.color.white};
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-bottom: 10px;

  .textLength {
    position: absolute;
    bottom: 5.5rem;
    right: 2.2rem;
    margin: 0.5rem 0.5rem;
    font-size: ${({ theme }) => theme.font.xsmall};
    color: ${({ theme }) => theme.color.grayDark};
  }
`;

const ProfileIntroInputBoxStyle = styled.textarea`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0.5rem 0.5rem;
  border: none;
  background: none;
  font-size: ${({ theme }) => theme.font.xsmall};
  color: ${({ theme }) => theme.color.black};
  resize: none;
`;

export default ProfileIntroInputBox;
