import React, { useState, ForwardedRef } from 'react';
import {styled} from 'styled-components';

interface QuestInputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  inputType?: "text" | "number";
}

const QuestInputBox = React.forwardRef(
  (
    { placeholder }: QuestInputBoxProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [questTitle, setQuestTitle] = useState(placeholder);

  const onChangeHandler = (event: any) => {
    event.preventDefault();
    setQuestTitle(event.target.value);
  }

    return (
      <QuestInputBoxLayoutStyle>
        <QuestInputBoxStyle 
          placeholder={placeholder} 
          ref={ref} 
          value={questTitle}
          onChange={onChangeHandler} />
      </QuestInputBoxLayoutStyle>
    );
  }
);

const QuestInputBoxLayoutStyle = styled.div`
  display: flex;
  align-items: center;

  width: 245px;
  height: 36px;

  background: ${({ theme }) => theme.color.white};
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-bottom: 10px;
`;

const QuestInputBoxStyle = styled.input`
  width: 100%;
  height: 100%;
  padding: 0 0.5rem;
  border: none;
  background: none;
  font-size: ${({ theme }) => theme.font.xsmall};
  color: ${({ theme }) => theme.color.grayDark};
`;

export default QuestInputBox;