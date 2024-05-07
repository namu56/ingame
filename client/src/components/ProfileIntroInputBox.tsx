import React, { useState, ForwardedRef } from 'react';
import styled from 'styled-components';

interface ProfileIntroInputBoxProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
}

const ProfileIntroInputBox = React.forwardRef(
  (
    { placeholder, ...props }: ProfileIntroInputBoxProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const [profileIntro, setprofileIntro] = useState(placeholder);

    const onChangeHandler = (event: any) => {
      event.preventDefault();
      setprofileIntro(event.target.value);
    };

    return (
      <ProfileIntroInputBoxLayoutStyle>
        <ProfileIntroInputBoxStyle
          placeholder={placeholder}
          ref={ref}
          {...props}
          value={profileIntro}
          onChange={onChangeHandler}
        />
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
`;

const ProfileIntroInputBoxStyle = styled.textarea`
  width: 100%;
  height: 100%;
  padding: 0.5rem 0.5rem;
  border: none;
  background: none;
  font-size: ${({ theme }) => theme.font.xsmall};
  color: ${({ theme }) => theme.color.grayDark};
  resize: none;
`;

export default ProfileIntroInputBox;
