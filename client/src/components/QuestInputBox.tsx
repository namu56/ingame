import React, { ForwardedRef } from 'react';
import { styled } from 'styled-components';

interface QuestInputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

const QuestInputBox = React.forwardRef(
  ({ placeholder, ...props }: QuestInputBoxProps, ref: ForwardedRef<HTMLInputElement>) => {

    return (
      <QuestInputBoxLayoutStyle>
        <QuestInputBoxStyle
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
      </QuestInputBoxLayoutStyle>
    );
  }
);

const QuestInputBoxLayoutStyle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;

  background: ${({ theme }) => theme.color.white};
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

const QuestInputBoxStyle = styled.input`
  width: 100%;
  height: 100%;
  padding: 0 0.5rem;
  border: none;
  background: none;
  font-size: ${({ theme }) => theme.font.xsmall};
  color: ${({ theme }) => theme.color.black};
`;

export default QuestInputBox;
