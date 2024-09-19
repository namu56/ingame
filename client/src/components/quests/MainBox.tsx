import styled from 'styled-components';
import { BsThreeDots } from 'react-icons/bs';
import { MdArrowDropDown } from 'react-icons/md';
import { MdArrowDropUp } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import SideBox from './SideBox';
import { MainQuest, QuestStatus, SideContent } from '@/models/quest.model';
import { useNavigate } from 'react-router-dom';
import { useMainQuest } from '@/hooks/useMainQuest';
import { formattedDate } from '@/utils/formatter';
import { useMessage } from '@/hooks/useMessage';
import { useSideQuest } from '@/hooks/useSideQuest';

export interface MainBoxProps {
  content: MainQuest;
  date: string;
  refetchMainBoxData: () => void;
}

const MainBox = ({ content, date, refetchMainBoxData }: MainBoxProps) => {
  const [sideQuests, setSideQuests] = useState(content.sideQuests);
  const [isAccordion, setIsAccordion] = useState(false);
  const { patchSideMutation } = useSideQuest();
  const { modifyMainQuestStatus } = useMainQuest();
  const { showConfirm, showAlert } = useMessage();
  const navigate = useNavigate();
  const fraction = `${sideQuests.filter((sideQuest) => sideQuest.status === 'COMPLETED').length} / ${sideQuests.length}`;

  useEffect(() => {
    setSideQuests(content.sideQuests);
  }, [content.sideQuests]);

  if (!content) {
    return null; // content가 없으면 렌더링하지 않음
  }

  const handleChangeStatus = () => {
    if (date === formattedDate(new Date())) {
      let message = '';
      let newStatus = '';
      if (content.status === 'ON_PROGRESS') {
        message = '퀘스트를 완료하시겠습니까?';
        newStatus = 'COMPLETED';
      } else if (content.status === 'COMPLETED') {
        message = '퀘스트를 진행중으로 변경하시겠습니까?';
        newStatus = 'ON_PROGRESS';
      } else {
        return;
      }

      showConfirm(message, () => {
        content.status = newStatus as QuestStatus;
        modifyMainQuestStatus({ id: content.id, status: content.status }).then(() => {
          refetchMainBoxData();
        });
      });
    } else {
      showAlert('당일 퀘스트만 변경 가능합니다');
    }
  };

  const handleNavigate = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (content.status === 'COMPLETED') return;
    navigate(`/editquest/${content.id}`, { state: { data: content, date } });
  };

  const handleToggleAccordion = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (content.status === 'COMPLETED') return;
    setIsAccordion((prevState) => !prevState);
  };

  const handleSideQuestStatusChange = (sideQuest: SideContent) => {
    if (date !== formattedDate(new Date())) {
      showAlert('당일 퀘스트만 변경 가능합니다');
      return;
    }

    if (sideQuest.id !== undefined) {
      const newStatus = sideQuest.status === 'COMPLETED' ? 'ON_PROGRESS' : 'COMPLETED';

      patchSideMutation.mutate(
        {
          questId: content.id,
          sideQuestId: sideQuest.id,
          status: newStatus,
        },
        {
          onSuccess: () => {
            setSideQuests((prev) =>
              prev.map((target) =>
                target.id === sideQuest.id ? { ...target, status: newStatus } : target
              )
            );
          },
        }
      );
    }
  };

  return (
    <>
      {content ? (
        <MainBoxContainer>
          <MainBoxStyle $status={content.status} onClick={handleChangeStatus}>
            <header className="aFContainer">
              <button className="aButton" onClick={handleToggleAccordion}>
                {isAccordion ? <MdArrowDropUp size={30} /> : <MdArrowDropDown size={30} />}
              </button>
              <p className="fDisplay">{fraction}</p>
            </header>
            <h1 className="title">{content.title}</h1>
            <div className="eButtonConatiner">
              <button className="eButton" onClick={handleNavigate}>
                <BsThreeDots />
              </button>
            </div>
          </MainBoxStyle>
          <SideBoxContainer>
            {sideQuests.map((sideQuest: SideContent) =>
              sideQuest.content ? (
                <SideBox
                  key={sideQuest.id}
                  isAccordion={isAccordion}
                  checked={sideQuest.status === 'COMPLETED'}
                  onClick={() => handleSideQuestStatusChange(sideQuest)}
                  content={sideQuest.content}
                />
              ) : null
            )}
          </SideBoxContainer>
        </MainBoxContainer>
      ) : null}
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

const MainBoxStyle = styled.div<{ $status: QuestStatus }>`
  width: 100%;
  height: 55px;

  background: ${({ theme, $status }) => theme.statusColor[$status]};
  color: ${({ theme, $status }) => $status !== 'ON_PROGRESS' && theme.color.grayDark};
  text-decoration: ${({ $status }) => $status !== 'ON_PROGRESS' && 'line-through'};
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

  .eButtonConatiner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
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
  margin-left: 9.5%;
`;

export default MainBox;
