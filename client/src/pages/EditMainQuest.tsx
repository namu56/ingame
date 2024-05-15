import styled from 'styled-components';
import { CiLock } from "react-icons/ci";
import { CiUnlock } from "react-icons/ci";
import { GoPlusCircle } from "react-icons/go";
import { Button } from 'antd';
import QuestInputBox from '@/components/QuestInputBox';
import { media } from '@/styles/theme';
import { useEditQuest } from '@/hooks/useEditQuest';

const EditMainQuestQuest = () => {
  const {
    isPrivate,
    setIsPrivate,
    isDifficulty,
    setIsDifficulty,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    today,
    register,
    onSubmit
  } = useEditQuest();

  return (
    <EditMainQuestQuestStyle>
      <header>
        <p>Main Quest</p>
        <div className='lockIcons'>
        {isPrivate ? <CiLock size={24} onClick={() => setIsPrivate(!isPrivate)} /> : <CiUnlock size={24} onClick={() => setIsPrivate(!isPrivate)} />}
        </div>
      </header>
      <form onSubmit={onSubmit}>
        <QuestInputBox placeholder='퀘스트 제목' {...register('title')} />
        <QuestButtonContainer>
          <Button className='easyButton' onClick={() => setIsDifficulty(0)}>EASY</Button>
          <Button className='normalButton' onClick={() => setIsDifficulty(1)}>NORMAL</Button>
          <Button className='hardButton' onClick={() => setIsDifficulty(2)}>HARD</Button>
        </QuestButtonContainer>
        <div className='plusContainer'>
          <h1>단계</h1>
          <GoPlusCircle onClick={() => isDifficulty === 2 ? '' : setIsDifficulty(isDifficulty + 1)} />
        </div>
        <InnerQuests>
        {Array(isDifficulty + 3).fill(0).map((quest, index) => 
          (
            <SideBoxContainer key={index}>
              <input 
                className='checkBoxInput'
                type='checkbox' 
                {...register(`side.${index}.status` as const)}
              />
              <QuestInputBox  
                placeholder='퀘스트 제목' 
                {...register(`side.${index}.content` as const)} 
              />
            </SideBoxContainer>
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
            })}
          />
        </div>
        <div className='modifiyAndClose'>
          <Button className='modifiyButton' htmlType='submit'>수정</Button>
          <Button className='closeButton'>닫기</Button>          
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
      font-size: 0.8rem;
      background-color: ${({ theme }) => theme.color.grayLightActive};
    }
  }

  .modifiyAndClose {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;

    button {
      width: 40%;
      color: ${({ theme }) => theme.color.white};
    }
    .modifiyButton {
      background-color: ${({ theme }) => theme.color.green};
    }
    .closeButton {
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

const SideBoxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .checkBoxInput {
    display: flex;
    align-items: center;
    width: 20px;
    height: 20px;
  }
`;

export default EditMainQuestQuest;