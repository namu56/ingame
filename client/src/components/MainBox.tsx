import styled from 'styled-components';
import { BsThreeDots } from 'react-icons/bs';
import { MdArrowDropDown } from 'react-icons/md';
import { MdArrowDropUp } from 'react-icons/md';
import { useState } from 'react';
import { sideQuestList } from '@/shared/dummy';
import SideBox from './SideBox';
import { Quest, QuestStatus, SideContent } from '@/models/quest.model';
import { useNavigate } from 'react-router-dom';
import { useMainQuest } from '@/hooks/useMainQuest';
import { formattedDate } from '@/utils/formatter';
import { useMessage } from '@/hooks/useMessage';

interface MainQuest extends Quest {
  sideQuests: SideContent[];
}

interface MainBoxProps {
  content: MainQuest;
}

const MainBox = ({ content }: MainBoxProps) => {
  const { modifyMainQuestStatus, patchSideMutation, date } = useMainQuest();
  const { showConfirm, showAlert } = useMessage();
  const navigate = useNavigate();
  const [isAccordion, setisAccordion] = useState(false);
  const [checked, setChecked] = useState(Array(sideQuestList.length).fill(false));
  const checkedCount = checked.reduce((count, isChecked) => (isChecked ? count + 1 : count), 0);
  const fraction = `${checkedCount} / ${content.sideQuests.length}`;
  
  const handleChangeStatue = () => {
    if (date === formattedDate(new Date())) {
      let message = '';
      if (content.status === 'ON_PROGRESS') {
        message = '퀘스트를 완료하시겠습니까?';
        content.status = 'COMPLETED';
      } else if (content.status === 'COMPLETED') {
        message = '퀘스트를 진행중으로 변경하시겠습니까?';
        content.status = 'ON_PROGRESS';
      } else {
        return;
      }

      showConfirm(message, () => {
        modifyMainQuestStatus({ id: content.id, status: content.status });
      });
    } else {
      showAlert('당일 퀘스트만 변경 가능합니다');
    }
  };

  const handleCheckboxClick = (index: number) => {
    setChecked((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleNavigate = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (content.status === 'COMPLETED') return;
    navigate(`/editquest/${content.id}`, { state: { content } });
  };


  const handleToggleAccordion = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (content.status === 'COMPLETED') return;
    setisAccordion(prevState => !prevState);
  }

  return (
    <>
      <MainBoxContainer>
        <MainBoxStyle status={content.status} onClick={handleChangeStatue}>
          <header className="aFContainer">
            <button className="aButton" onClick={handleToggleAccordion}>
              {isAccordion ? <MdArrowDropUp size={30} /> : <MdArrowDropDown size={30} />}
            </button>
            <p className="fDisplay">{fraction}</p>
          </header>
          <h1 className="title">{content.title}</h1>
          <div>
            <button className="eButton" onClick={handleNavigate}>
              <BsThreeDots />
            </button>
          </div>
        </MainBoxStyle>
        <SideBoxContainer>
          {content && content.sideQuests ? (
            content.sideQuests.map((quest, index) =>
              quest.content ? (
                <SideBox
                  key={index}
                  isAccordion={isAccordion}
                  checked={checked[index]}
                  onClick={() => {
                    if (quest.id !== undefined) {
                      patchSideMutation.mutate(quest.id);
                      handleCheckboxClick(index);
                    }
                  }}
                  content={quest.content}
                />
              ) : null
            )
          ) : (
            <div>내용이 없습니다.</div>
          )}
        </SideBoxContainer>
      </MainBoxContainer>
    </>
  );
};

const MainBoxContainer = styled.div`
  display: flex;
  gap: 5px;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const MainBoxStyle = styled.div<{ status: QuestStatus }>`
  width: 100%;
  height: 55px;

  background: ${({ theme, status }) => theme.statusColor[status]};
  color: ${({ theme, status }) => status !== 'ON_PROGRESS' && theme.color.grayDark};
  text-decoration: ${({ status }) => status !== 'ON_PROGRESS' && 'line-through'};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.medium};

  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  .aFContainer {
    display: flex;
    align-items: center;
    gap: 5px;

    .aButton {
      width: 30px;
      height: 30px;
    }
  }

  .fDisplay {
    font-size: 0.9rem;
  }

  .title {
    width: 11rem;
  }

  .eButton {
    padding-right: 20px;
  }
`;

const SideBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 90%;
  gap: 5px;
  margin-right: 11.7%;
`;

export default MainBox;
