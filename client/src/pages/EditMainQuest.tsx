import styled from 'styled-components';
import { CiLock } from "react-icons/ci";
import { CiUnlock } from "react-icons/ci";
import { GoPlusCircle } from "react-icons/go";
import { useState } from 'react';
import { Button } from 'antd';
import QuestInputBox from '@/components/QuestInputBox';
import { media } from '@/styles/theme';
import { useFieldArray, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Quest } from '@/models/quest.model';
import { useNavigate } from 'react-router-dom';
import { PatchQuest } from '@/api/quest.api';

interface SideContent {
  content: string;
}

interface EditMainQuestQuestProps extends Quest {
  title: string;
  difficulty: number;
  side: SideContent[];
  startDate: string;
  endDate: string;
  hidden: number;
}

const EditMainQuestQuest = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [isDifficulty, setIsDifficulty] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const today = new Date().toISOString().substring(0, 10);
  const navigate = useNavigate();

  const { register, control, handleSubmit } = useForm<EditMainQuestQuestProps>();
  const {} = useFieldArray({
    control,
    name: "side"
  });

  const onSubmit = handleSubmit((data) => {
    const hidden = isPrivate ? 1 : 0;
    const newData = {...data, hidden, difficulty: isDifficulty};
    EditQuestMutation.mutate(newData);
  });

  const EditQuestMutation = useMutation({
    mutationFn: PatchQuest,
    onSuccess(res) {
      // navigate('/');
    },
    onError(err) {
      navigate('/error');
    },
  });

  return (
    <EditMainQuestQuestStyle>
      <header>
        <p>Main Quest</p>
        {isPrivate ? <CiLock size={24} onClick={() => setIsPrivate(!isPrivate)} /> : <CiUnlock size={24} onClick={() => setIsPrivate(!isPrivate)} />}
      </header>
      <form onSubmit={onSubmit}>
        <QuestInputBox placeholder='퀘스트 제목' {...register('title')} />
        <QuestButtonContainer>
          <Button onClick={() => setIsDifficulty(0)}>EASY</Button>
          <Button onClick={() => setIsDifficulty(1)}>NORMAL</Button>
          <Button onClick={() => setIsDifficulty(2)}>HARD</Button>
        </QuestButtonContainer>
        <div className='plusContainer'>
          <h1>단계</h1>
          <GoPlusCircle onClick={() => isDifficulty === 2 ? '' : setIsDifficulty(isDifficulty + 1)} />
        </div>
        <InnerQuests>
          {Array(isDifficulty + 3).fill(0).map((_, index) => 
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
          <Button htmlType='submit'>수정</Button>
          <Button>닫기</Button>          
        </div>
      </form>
    </EditMainQuestQuestStyle>
  );
};

const EditMainQuestQuestStyle = styled.div`
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
      background-color: ${({ theme }) => theme.color.grayNormal};
    }
  }

  .modifiyAndClose {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;

    button {
      width: 40%;
    }
    button:first-child {
      background-color: ${({ theme }) => theme.color.green};
    }
    button:first-child:hover {
      background-color: ${({ theme }) => theme.color.greenOpactiy30};
    }
    button:last-child {
      background-color: ${({ theme }) => theme.color.grayNormal};
    }
    button:last-child:hover {
      background-color: ${({ theme }) => theme.color.grayNormalActive};
    } 
  }
`;

const QuestButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    width: 31%;
  }
`;

const InnerQuests = styled.div` 
  min-height: 230px;
`

export default EditMainQuestQuest;