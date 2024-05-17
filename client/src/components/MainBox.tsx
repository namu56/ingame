import styled from 'styled-components';
import { BsThreeDots } from "react-icons/bs";
import { MdArrowDropDown } from "react-icons/md";
import { MdArrowDropUp } from "react-icons/md";
import { useState } from 'react';
import { sideQuestList } from '@/shared/dummy';
import SideBox from './SideBox';
import { getQuest } from '@/models/quest.model';
import { useMutation } from '@tanstack/react-query';
import { modiSideQuest } from '@/api/quests.api';
import { useNavigate } from 'react-router-dom';

interface MainBoxProps {
  content: getQuest;
}

const MainBox = ({content}: MainBoxProps) => {
  const [isAccordion, setisAccordion] = useState(false);
  const [checked, setChecked] = useState(Array(sideQuestList.length).fill(false));
  const navigate = useNavigate();

  const handleCheckboxClick = (index: number) => {
    setChecked(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    })
  };
  const checkedCount = checked.reduce((count, isChecked) => isChecked ? count + 1 : count, 0);
  const fraction = `${checkedCount} / ${content.sideQuests.length}`;

  const handleNavigate = () => {
    navigate(`/editquest/${content.id}`, { state: { content } });
  }

  const handleToggleAccordion = () => {
    setisAccordion(prevState => !prevState);
  }

  const patchSideMutation = useMutation({
    mutationFn: modiSideQuest,
    onSuccess(res) {
      // navigate('/');
    },
    onError(err) {
      navigate('/error');
    },
  });

  return (
    <>
    <MainBoxContainer>
      <MainBoxStyle onClick={handleToggleAccordion}>
        <header className='aFContainer'>
          <button className='aButton'>{isAccordion ? (<MdArrowDropUp size={30} />) : (<MdArrowDropDown size={30} />)}</button>
          <p className='fDisplay'>{fraction}</p>
        </header>
        <h1 className='title'>{content.title}</h1>
        <button className='eButton' onClick={handleNavigate}><BsThreeDots /></button>
      </MainBoxStyle>
      <SideBoxContainer>
        {content.sideQuests.map((quest, index) => (
          <SideBox
            key={index}
            isAccordion={isAccordion}
            checked={checked[index]}
            onClick={() => {
              patchSideMutation.mutate(quest.id); 
              handleCheckboxClick(index)
            }}
            content={quest.content}
          />
        ))}
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

const MainBoxStyle = styled.div`
  width: 100%;
  height: 55px;
  background: ${({ theme }) => theme.color.white};
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