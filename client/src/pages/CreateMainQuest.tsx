import styled from 'styled-components';
import { CiLock } from "react-icons/ci";
import { CiUnlock } from "react-icons/ci";
import { FiPlusCircle } from "react-icons/fi";
import { FiMinusCircle } from "react-icons/fi";
import { Button } from 'antd';
import QuestInputBox from '@/components/QuestInputBox';
import { media } from '@/styles/theme';
import { useCreateQuest } from '@/hooks/useCreateQuest';
import { useState } from 'react';

const CreateMainQuest = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [plusQuest, setPlusQuest] = useState(1);
  const [minusQuest, setMinusQuest] = useState(0);
  const today = new Date().toISOString().substring(0, 10);

  const {
    isPrivate,
    setIsPrivate,
    isDifficulty,
    setIsDifficulty,
    register,
    control,
    handleSubmit,
    onSubmit,
    CreateQuestMutation
  } = useCreateQuest();
  
  return (
    <CreateMainQuestStyle>
      <header>
        <p>메인 퀘스트 생성</p>
        <div className='lockIcons'>
          {isPrivate ? <CiLock size={24} onClick={() => setIsPrivate(!isPrivate)} /> : <CiUnlock size={24} onClick={() => setIsPrivate(!isPrivate)} />}
        </div>
      </header>
      <form onSubmit={onSubmit}>
        <QuestInputBox placeholder='퀘스트 제목' {...register('title')} />
        <QuestButtonContainer>
          <Button className={`easyButton ${isDifficulty === 0 ? 'isActive' : ''}`} onClick={() => setIsDifficulty(0)}>EASY</Button>
          <Button className={`normalButton ${isDifficulty === 1 ? 'isActive' : ''}`} onClick={() => setIsDifficulty(1)}>NORMAL</Button>
          <Button className={`hardButton ${isDifficulty === 2 ? 'isActive' : ''}`} onClick={() => setIsDifficulty(2)}>HARD</Button>
        </QuestButtonContainer>
        <div className='plusContainer'>
          <h1>퀘스트 추가</h1>
          <FiPlusCircle onClick={() => {
            if (plusQuest - minusQuest < 5) {
              setPlusQuest(plusQuest + 1);
            }
          }} />
          <FiMinusCircle onClick={() => {
            if (minusQuest < plusQuest && plusQuest - minusQuest !== 1) {
              setMinusQuest(minusQuest + 1);
            }
          }} />
        </div>
        <InnerQuests>
          {Array(plusQuest - minusQuest).fill(0).map((_, index) => 
          (
            <QuestInputBox key={index} placeholder='퀘스트 제목' {...register(`side.${index}.content` as const)} />
          )
          )}
        </InnerQuests>
        <h3 className='period'>기간</h3>
        <div className='dateContainer'>
          <input 
            className='startDate'
            type='date' 
            value={today} 
            {...register('startDate', { 
              required: true, 
              onChange: e => setStartDate(e.target.value)
            })} 
          />
          <input 
            className='endDate'
            type='date' 
            {...register('endDate', {
              required: true, 
              onChange: e => setEndDate(e.target.value)
            })} />
        </div>
        <div className='modifiyAndClose'>
          <Button htmlType='submit' children={'추가하기'} />
        </div>
      </form>
    </CreateMainQuestStyle>
  );
};

const CreateMainQuestStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1rem;
  width: 100%;

  header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    p {
      font-size: 1.5rem;
      font-family: 'Pretendard600';
    }

    .lockIcons {
      cursor: pointer;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 80%;
    ${media.mobile} {
      width: 100%;
    }
  }

  .plusContainer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .period {
    font-size: 0.8rem;
  }

  .dateContainer {
    display: flex;
    justify-content: space-between;
    
    input {
      width: 47%;
      padding: 0.2rem;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 5px;
      background-color: ${({ theme }) => theme.color.grayLightActive};
    }
  }

  .modifiyAndClose {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;

    button {
      width: 60%;
      background-color: ${({ theme }) => theme.color.green};
      color: ${({ theme }) => theme.color.white};
    }
  }
`;

const QuestButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    width: 31%;
  }

  .isActive {
    background-color: pink;
  }
  .easyButton {
    color: ${({ theme }) => theme.color.purple};
    border: 1px solid ${({ theme }) => theme.color.purple};
  }
  .normalButton {
    color: ${({ theme }) => theme.color.blue};
    border: 1px solid ${({ theme }) => theme.color.blue};
  }
  .hardButton {
    color: ${({ theme }) => theme.color.coral};
    border: 1px solid ${({ theme }) => theme.color.coral};
  }
`;

const InnerQuests = styled.div` 
  min-height: 230px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export default CreateMainQuest;


