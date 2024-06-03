import styled from 'styled-components';
import { CiLock } from 'react-icons/ci';
import { CiUnlock } from 'react-icons/ci';
import Button from '@/components/common/Button';
import QuestInputBox from '@/components/quests/QuestInputBox';
import { media } from '@/styles/theme';
import { useLocation, useNavigate } from 'react-router-dom';
import { SideContent } from '@/models/quest.model';
import CloseButton from '@/components/common/CloseButton';
import { useConfirmDelete, useEditMainQuestForm } from '@/hooks/useMainQuest';

const EditMainQuestQuest = () => {
  const { state } = useLocation();
  const { data: content, date } = state;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    title,
    setTitle,
    isDifficulty,
    setIsDifficulty,
    sideQuests,
    setSideQuests,
    isPrivate,
    setIsPrivate,
  } = useEditMainQuestForm(content, date);

  const { handleDeleteBtn } = useConfirmDelete(content);

  return (
    <>
      <CloseButton onClick={() => navigate('/')} />
      <EditMainQuestQuestStyle>
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
        <form onSubmit={handleSubmit}>
          <input type="hidden" value={isDifficulty} {...register('difficulty')} />
          <input type="hidden" value={content.id} {...register('id')} />
          <QuestInputBox
            value={title}
            {...register('title')}
            onChange={(e) => setTitle(e.target.value)}
          />
          <QuestButtonContainer>
            <Button
              type='button'
              className={`easyButton ${isDifficulty === 'EASY' ? 'isActive' : ''}`}
              onClick={() => setIsDifficulty('EASY')}
              children={'EASY'}
              size={'medium'}
              color={'white'}
            />
            <Button
              type='button'
              className={`normalButton ${isDifficulty === 'NORMAL' ? 'isActive' : ''}`}
              onClick={() => setIsDifficulty('NORMAL')}
              children={'NORMAL'}
              size={'medium'}
              color={'white'}
            />
            <Button
              type='button'
              className={`hardButton ${isDifficulty === 'HARD' ? 'isActive' : ''}`}
              onClick={() => setIsDifficulty('HARD')}
              children={'HARD'}
              size={'medium'}
              color={'white'}
            />
          </QuestButtonContainer>
          <div className="plusContainer">
          </div>
          <InnerQuests>
            {content.sideQuests &&
              content.sideQuests.map((sideQuest: SideContent, index: number) => (
                <SideBoxContainer key={index}>
                  <input
                    className="checkBoxInput"
                    type="checkbox"
                    checked={sideQuest.status === 'COMPLETED' ? true : false}
                    {...register(`sideQuests.${index}.status`)}
                    onChange={(e) => {
                      const newStatus = e.target.checked ? 'COMPLETED' : 'ON_PROGRESS';
                      const newSideQuests = [...(sideQuests || [])];
                      newSideQuests[index].status = newStatus;
                      setSideQuests(newSideQuests);
                    }}
                  />
                  <QuestInputBox
                    value={sideQuest.content}
                    {...register(`sideQuests.${index}.content`)}
                    onChange={(e) => {
                      const newContent = e.target.value;
                      const newSideQuests = [...(sideQuests || [])];
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
              type='button'
              className="closeButton"
              children={'삭제'}
              size={'medium'}
              color={'black'}
              onClick={handleDeleteBtn}
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

  .checkBoxInput {
    display: flex;
    align-items: center;
    width: 20px;
    height: 20px;
  }
`;

export default EditMainQuestQuest;
