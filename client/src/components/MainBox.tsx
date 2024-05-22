import styled from 'styled-components';
import { BsThreeDots } from 'react-icons/bs';
import { MdArrowDropDown } from 'react-icons/md';
import { MdArrowDropUp } from 'react-icons/md';
import { useState } from 'react';
import { sideQuestList } from '@/shared/dummy';
import SideBox from './SideBox';
import { Quest, QuestStatus, SideContent } from '@/models/quest.model';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMainQuest } from '@/hooks/useMainQuest';
import { formattedDate } from '@/utils/formatter';
import { useMessage } from '@/hooks/useMessage';
import { BASE_KEY } from '@/constant/queryKey';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getFindOneMainQuest } from '@/api/quests.api';

interface MainQuest extends Quest {
  sideQuests: SideContent[];
}

export interface MainBoxProps {
  content: MainQuest;
  date: string;
}

const MainBox = ({ content, date }: MainBoxProps) => {
  const location = useLocation();
  const updatedData = location.state?.updatedData;
  const mainContent = updatedData || content;
  const { modifyMainQuestStatus, patchSideMutation } = useMainQuest();
  const { showConfirm, showAlert } = useMessage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAccordion, setisAccordion] = useState(false);
  const [checked, setChecked] = useState(Array(sideQuestList.length).fill(false));
  const [sideQuests, setSideQuests] = useState(content.sideQuests);
  const fraction = `${sideQuests.filter((item) => item.status === 'COMPLETED').length} / ${content.sideQuests.length}`;

  const { data, isLoading, error } = useQuery({
    queryKey: [BASE_KEY.QUEST, content.id],
    queryFn: () => getFindOneMainQuest(content.id),
  });

  if (!mainContent) {
    return null; // mainContent가 없으면 렌더링하지 않음
  }

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
        modifyMainQuestStatus({ id: mainContent.id, status: mainContent.status });
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
    if (mainContent.status === 'COMPLETED') return;
    navigate(`/editquest/${mainContent.id}`, { state: { data: data , date } });
  };


  const handleToggleAccordion = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (mainContent.status === 'COMPLETED') return;
    setisAccordion(prevState => !prevState);
  }

  return (
    <>
      {mainContent ? (
        <MainBoxContainer>
          <MainBoxStyle status={mainContent.status} onClick={handleChangeStatue}>
            <header className="aFContainer">
              <button className="aButton" onClick={handleToggleAccordion}>
                {isAccordion ? <MdArrowDropUp size={30} /> : <MdArrowDropDown size={30} />}
              </button>
              <p className="fDisplay">{fraction}</p>
            </header>
            <h1 className="title">{mainContent.title}</h1>
            <div className='eButtonConatiner'>
              <button className="eButton" onClick={handleNavigate}>
                <BsThreeDots />
              </button>
            </div>
          </MainBoxStyle>
          <SideBoxContainer>
          {mainContent.sideQuests.map((quest: SideContent, index: number) =>
            quest.content ? (
              <SideBox
                key={index}
                isAccordion={isAccordion}
                checked={sideQuests[index]?.status === 'COMPLETED'}
                onClick={() => {
                  if (quest.id !== undefined && sideQuests[index]?.status) {
                    const questStatus = sideQuests[index].status || 'ON_PROGRESS';
                    const newStatus = questStatus === 'COMPLETED' ? 'ON_PROGRESS' : 'COMPLETED';

                    patchSideMutation.mutate({ param: quest.id, status: newStatus }, {
                      onSuccess: () => {
                        setSideQuests((prev) => {
                          const newState = [...prev];
                          newState[index] = {
                            ...newState[index],
                            status: newStatus
                          };
                          return newState;
                        });
                        handleCheckboxClick(index);

                        queryClient.setQueryData([BASE_KEY.QUEST, mainContent.id], (oldData: Quest) => {
                          return {
                            ...oldData,
                            sideQuests: oldData.sideQuests.map((item, i) => 
                              i === index ? { ...item, status: newStatus } : item
                            )
                          };
                        });
                      },
                    });
                  }
                }}
                content={quest.content}
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
