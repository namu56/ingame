import styled from 'styled-components';
import { CiLock } from 'react-icons/ci';
import { CiUnlock } from 'react-icons/ci';
import Button from '@/components/Button';
import QuestInputBox from '@/components/QuestInputBox';
import { media } from '@/styles/theme';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';
import { QuestHiddenType, SideContent } from '@/models/quest.model';
import CloseButton from '@/components/CloseButton';
import { useForm } from 'react-hook-form';
import { EditMainQuestQuestProps, useMainQuest } from '@/hooks/useMainQuest';

const EditMainQuestQuest = () => {
  // MainBox에서 Content 값
  const { state } = useLocation();
  const content = state.content;
  const [startDate, setStartDate] = useState(content.startDate);
  const [endDate, setEndDate] = useState(content.endDate);
  const [title, setTitle] = useState(content.title);
  const [isDifficulty, setIsDifficulty] = useState(content.difficulty);
  const [plusQuest, setPlusQuest] = useState(content.sideQuests.length);
  const [minusQuest, setMinusQuest] = useState(0);
  const [sideQuests, setSideQuests] = useState(content.sideQuests);
  const [isPrivate, setIsPrivate] = useState(false);
  const { EditQuestMutation } = useMainQuest();
  const navigate = useNavigate();

  const { register, control, handleSubmit } = useForm<EditMainQuestQuestProps>();

  const onSubmit = handleSubmit((data) => {
    const hidden = (isPrivate ? 'TRUE' : 'FALSE') as QuestHiddenType;
    const newData = { ...data, hidden: hidden };
    EditQuestMutation.mutate(newData);
  });

  return (
    <>
      <CloseButton onClick={() => navigate('/')} />
      <EditMainQuestQuestStyle>
        <header>
          <p>메인 퀘스트 수정</p>
          <div className="lockIcons">
            {content.hidden ? (
              <CiLock size={24} onClick={() => setIsPrivate(!isPrivate)} />
            ) : (
              <CiUnlock size={24} onClick={() => setIsPrivate(!isPrivate)} />
            )}
          </div>
        </header>
        <form onSubmit={onSubmit}>
          <input type="hidden" value={isDifficulty} {...register('difficulty')} />
          <input type="hidden" value={content.id} {...register('id')} />
          <QuestInputBox
            value={title}
            {...register('title')}
            onChange={(e) => setTitle(e.target.value)}
          />
          <QuestButtonContainer>
            <Button
              className={`easyButton ${isDifficulty === 0 ? 'isActive' : ''}`}
              onClick={() => setIsDifficulty(0)}
              children={'EASY'}
              size={'medium'}
              color={'black'}
            ></Button>
            <Button
              className={`normalButton ${isDifficulty === 1 ? 'isActive' : ''}`}
              onClick={() => setIsDifficulty(1)}
              children={'NORMAL'}
              size={'medium'}
              color={'black'}
            ></Button>
            <Button
              className={`hardButton ${isDifficulty === 2 ? 'isActive' : ''}`}
              onClick={() => setIsDifficulty(2)}
              children={'HARD'}
              size={'medium'}
              color={'black'}
            ></Button>
          </QuestButtonContainer>
          <div className="plusContainer">
            <h1>단계</h1>
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
            {content.sideQuests &&
              content.sideQuests.map((sideQuest: SideContent, index: number) => (
                <SideBoxContainer key={index}>
                  <input
                    className="checkBoxInput"
                    type="checkbox"
                    checked={sideQuest.status === 'COMPLETED'}
                    {...register(`sideQuests.${index}.status`)}
                    onChange={(e) => {
                      const newStatus = e.target.checked ? 'COMPLETED' : 'ON_PROGRESS';
                      const newSideQuests = [...sideQuests];
                      newSideQuests[index].status = newStatus;
                      setSideQuests(newSideQuests);
                    }}
                  />
                  <QuestInputBox
                    value={sideQuest.content}
                    {...register(`sideQuests.${index}.content`)}
                    onChange={(e) => {
                      const newContent = e.target.value;
                      const newSideQuests = [...sideQuests];
                      newSideQuests[index].content = newContent;
                      setSideQuests(newSideQuests);
                    }}
                  />
                </SideBoxContainer>
              ))}
          </InnerQuests>
          <h3 className="period">기간</h3>
          <div className="dateContainer">
            <input
              className="startDate"
              type="date"
              value={startDate}
              {...register('startDate', {
                required: true,
                onChange: (e) => setStartDate(e.target.value),
              })}
            />
            <input
              className="endDate"
              type="date"
              value={endDate}
              {...register('endDate', {
                required: true,
                onChange: (e) => setEndDate(e.target.value),
              })}
            />
          </div>
          <div className="modifiyAndClose">
            <Button
              className="modifiyButton"
              type={'submit'}
              children={'수정'}
              size={'medium'}
              color={'black'}
            />
            <Button
              className="closeButton"
              children={'닫기'}
              size={'medium'}
              color={'black'}
              onClick={() => navigate('/')}
            />
          </div>
        </form>
      </EditMainQuestQuestStyle>
    </>
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
      background-color: ${({ theme }) => theme.color.grayLight};
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
      background-color: ${({ theme }) => theme.color.grayNormal};
    }
  }
`;

const QuestButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;

  .isActive {
    background-color: pink;
  }
  button {
    width: 31%;
  }
`;

const InnerQuests = styled.div`
  min-height: 230px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

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
