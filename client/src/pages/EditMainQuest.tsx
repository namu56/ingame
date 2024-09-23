import styled from 'styled-components';
import { CiLock } from 'react-icons/ci';
import { CiUnlock } from 'react-icons/ci';
import Button from '@/components/common/Button';
import QuestInputBox from '@/components/quests/QuestInputBox';
import { media } from '@/styles/theme';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainQuest, SideContent } from '@/models/quest.model';
import CloseButton from '@/components/common/CloseButton';
import { useConfirmDelete, useEditMainQuestForm } from '@/hooks/useMainQuest';
import { MAX_SIDE_QUESTS, MIN_SIDE_QUESTS, QUEST_DIFFICULTY } from '@/constant/quest';
import { useForm } from 'react-hook-form';
import { CreateMainQuestProps } from './CreateMainQuest';
import { useState } from 'react';

export interface UpdateMainQuestProps extends Omit<CreateMainQuestProps, 'sideQuests'> {
  id: number;
  sideQuests: UpdateSideQuestProps[];
}

export interface UpdateSideQuestProps {
  id?: number;
  content: string;
}

interface LocationState {
  data: MainQuest;
  date: string;
}

const EditMainQuest = () => {
  const { state } = useLocation();
  const { data: content, date } = state as LocationState;
  const navigate = useNavigate();
  const [sideQuests, setSideQuests] = useState<UpdateSideQuestProps[]>(
    content.sideQuests.map(
      (sideQuest) =>
        ({
          id: sideQuest.id,
          content: sideQuest.content,
        }) as UpdateSideQuestProps
    )
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateMainQuestProps>();

  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    title,
    setTitle,
    isDifficulty,
    setIsDifficulty,
    isPrivate,
    setIsPrivate,
    onSubmit,
  } = useEditMainQuestForm(content, date);

  const { handleDeleteBtn } = useConfirmDelete(content);

  const addSideQuest = () => {
    if (sideQuests.length < MAX_SIDE_QUESTS) {
      setSideQuests([...sideQuests, { content: '' }]);
    }
  };

  const removeSideQuest = (index: number) => {
    if (sideQuests.length > MIN_SIDE_QUESTS) {
      setSideQuests(sideQuests.filter((_, i) => i !== index));
    }
  };

  const updateSideQuest = (index: number, newContent: string) => {
    setSideQuests((prevSideQuests) => {
      const updatedSideQuests = [...prevSideQuests];
      updatedSideQuests[index] = { ...updatedSideQuests[index], content: newContent };
      return updatedSideQuests;
    });
  };

  const handleFormSubmit = (data: UpdateMainQuestProps) => {
    const newData = {
      ...data,
      sideQuests,
    };
    onSubmit(newData, date);
  };

  return (
    <>
      <CloseButton onClick={() => navigate('/')} />
      <EditMainQuestStyle>
        <header>
          <p>메인 퀘스트 수정</p>
          <div className="lockIcons">
            {isPrivate ? (
              <CiLock size={24} onClick={() => setIsPrivate(false)} />
            ) : (
              <CiUnlock size={24} onClick={() => setIsPrivate(true)} />
            )}
          </div>
        </header>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <input type="hidden" value={isDifficulty} {...register('difficulty')} />
          <input type="hidden" value={content.id} {...register('id')} />
          <QuestInputBox
            value={title}
            {...register('title', { required: 'true' })}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="error-text">퀘스트 제목을 입력하세요</p>}
          <QuestButtonContainer>
            <Button
              type="button"
              className={`easyButton ${isDifficulty === QUEST_DIFFICULTY.EASY ? 'isActive' : ''}`}
              onClick={() => setIsDifficulty(QUEST_DIFFICULTY.EASY)}
              children={QUEST_DIFFICULTY.EASY}
              size={'medium'}
              color={'white'}
            />
            <Button
              type="button"
              className={`normalButton ${isDifficulty === QUEST_DIFFICULTY.NORMAL ? 'isActive' : ''}`}
              onClick={() => setIsDifficulty(QUEST_DIFFICULTY.NORMAL)}
              children={QUEST_DIFFICULTY.NORMAL}
              size={'medium'}
              color={'white'}
            />
            <Button
              type="button"
              className={`hardButton ${isDifficulty === QUEST_DIFFICULTY.HARD ? 'isActive' : ''}`}
              onClick={() => setIsDifficulty(QUEST_DIFFICULTY.HARD)}
              children={QUEST_DIFFICULTY.HARD}
              size={'medium'}
              color={'white'}
            />
          </QuestButtonContainer>
          <InnerQuests>
            {sideQuests.map((sideQuest: SideContent & { isNew?: boolean }, index: number) => (
              <SideBoxContainer key={index}>
                <QuestInputBox
                  value={sideQuest.content}
                  onChange={(e) => updateSideQuest(index, e.target.value)}
                  placeholder="퀘스트 내용을 입력하세요"
                />
                <DeleteButton
                  type="button"
                  onClick={() => removeSideQuest(index)}
                  children="삭제"
                  size="small"
                  color="red"
                />
              </SideBoxContainer>
            ))}
            {sideQuests.length < MAX_SIDE_QUESTS && (
              <Button
                type="button"
                onClick={addSideQuest}
                children="퀘스트 추가"
                size="medium"
                color="blue"
              />
            )}
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
          {(errors.startDate || errors.endDate) && <p className="error-text">기간을 입력하세요</p>}
          <div className="modifiyAndClose">
            <Button
              className="modifiyButton"
              type="submit"
              children="수정"
              size="medium"
              color="black"
            />
            <Button
              type="button"
              className="closeButton"
              children="삭제"
              size="medium"
              color="black"
              onClick={handleDeleteBtn}
            />
          </div>
        </form>
      </EditMainQuestStyle>
    </>
  );
};

const EditMainQuestStyle = styled.div`
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

    .error-text {
      color: ${({ theme }) => theme.color.red};
      margin-top: 5px;
      font-size: 13px;
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
      background-color: ${({ theme }) => theme.color.red};
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

const SideBoxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DeleteButton = styled(Button)`
  min-width: 50px;
  height: 36px;
  padding: 0 10px;
  font-size: 0.8rem;
`;

export default EditMainQuest;
