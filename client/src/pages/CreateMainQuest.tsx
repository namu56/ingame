import styled from 'styled-components';
import { CiLock } from 'react-icons/ci';
import { CiUnlock } from 'react-icons/ci';
import { FiPlusCircle } from 'react-icons/fi';
import { FiMinusCircle } from 'react-icons/fi';
import Button from '@/components/common/Button';
import QuestInputBox from '@/components/quests/QuestInputBox';
import { media } from '@/styles/theme';
import CloseButton from '@/components/common/CloseButton';
import { useNavigate } from 'react-router-dom';
import { useCreateMainQuestForm } from '@/hooks/useMainQuest';

const CreateMainQuest = () => {
  const {
    register,
    isPrivate,
    setIsPrivate,
    isDifficulty,
    setIsDifficulty,
    plusQuest,
    setPlusQuest,
    minusQuest,
    setMinusQuest,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    today,
    handleSubmit,
  } = useCreateMainQuestForm();
  const navigate = useNavigate();

  return (
    <>
      <CloseButton onClick={() => navigate('/')} />
      <CreateMainQuestStyle>
        <header>
          <p>메인 퀘스트 생성</p>
          <div className="lockIcons">
            {isPrivate ? (
              <CiLock size={24} onClick={() => setIsPrivate(!isPrivate)} />
            ) : (
              <CiUnlock size={24} onClick={() => setIsPrivate(!isPrivate)} />
            )}
          </div>
        </header>
        <form onSubmit={handleSubmit}>
          <QuestInputBox placeholder="퀘스트 제목" {...register('title')} />
          <QuestButtonContainer>
            <Button
              type="button"
              className={`easyButton ${isDifficulty === 0 ? 'isActive' : ''}`}
              onClick={() => setIsDifficulty(0)}
              children={'EASY'}
              size={'medium'}
              color={'white'}
            />
            <Button
              type="button"
              className={`normalButton ${isDifficulty === 1 ? 'isActive' : ''}`}
              onClick={() => setIsDifficulty(1)}
              children={'NORMAL'}
              size={'medium'}
              color={'white'}
            />
            <Button
              type="button"
              className={`hardButton ${isDifficulty === 2 ? 'isActive' : ''}`}
              onClick={() => setIsDifficulty(2)}
              children={'HARD'}
              size={'medium'}
              color={'white'}
            />
          </QuestButtonContainer>
          <div className="plusContainer">
            <h1>퀘스트 추가</h1>
            <FiPlusCircle
              onClick={() => {
                if (plusQuest - minusQuest < 5) {
                  setPlusQuest(plusQuest + 1);
                }
              }}
            />
            <FiMinusCircle
              onClick={() => {
                if (minusQuest < plusQuest && plusQuest - minusQuest !== 1) {
                  setMinusQuest(minusQuest + 1);
                }
              }}
            />
          </div>
          <InnerQuests>
            {Array(plusQuest - minusQuest)
              .fill(0)
              .map((_, index) => (
                <QuestInputBox
                  key={index}
                  placeholder="퀘스트 제목"
                  {...register(`sideQuests.${index}.content` as const, { required: true })}
                />
              ))}
          </InnerQuests>
          <h3 className="period">기간</h3>
          <div className="dateContainer">
            <input
              className="startDate"
              type="date"
              value={startDate || today}
              {...register('startDate', {
                required: true,
                onChange: (e) => setStartDate(e.target.value),
              })}
            />
            <input
              className="endDate"
              type="date"
              value={endDate || ''}
              {...register('endDate', {
                required: true,
                onChange: (e) => setEndDate(e.target.value),
              })}
            />
          </div>
          <div className="modifiyAndClose">
            <Button type={'submit'} children={'추가하기'} size={'medium'} color={''} />
          </div>
        </form>
      </CreateMainQuestStyle>
    </>
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
      background-color: ${({ theme }) => theme.color.grayLight};
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
  .easyButton {
    border: 1px solid ${({ theme }) => theme.color.purple};
    color: ${({ theme }) => theme.color.purple};

    &.isActive {
      background-color: ${({ theme }) => theme.color.purple};
      color: ${({ theme }) => theme.color.white};
    }
  }

  .normalButton {
    border: 1px solid ${({ theme }) => theme.color.blue};
    color: ${({ theme }) => theme.color.blue};

    &.isActive {
      background-color: ${({ theme }) => theme.color.blue};
      color: ${({ theme }) => theme.color.white};
    }
  }

  .hardButton {
    border: 1px solid ${({ theme }) => theme.color.coral};
    color: ${({ theme }) => theme.color.coral};

    &.isActive {
      background-color: ${({ theme }) => theme.color.coral};
      color: ${({ theme }) => theme.color.white};
    }
  }
`;

const InnerQuests = styled.div`
  min-height: 230px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export default CreateMainQuest;
