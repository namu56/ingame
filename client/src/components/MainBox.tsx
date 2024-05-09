import styled from 'styled-components';
import { BsThreeDots } from "react-icons/bs";
import { MdArrowDropDown } from "react-icons/md";
import { MdArrowDropUp } from "react-icons/md";
import { useState } from 'react';
import { sideQuestList } from '@/shared/dummy';
import SideBox from './SideBox';


const MainBox = () => {
  const [isAccordion, setisAccordion] = useState(false);
  const [checked, setChecked] = useState(Array(sideQuestList.length).fill(false));

  const handleCheckboxClick = (index: number) => {
    setChecked(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    })
  };

  const checkedCount = checked.reduce((count, isChecked) => isChecked ? count + 1 : count, 0);
  const MainText = `메인 퀘스트 제목`;
  const fraction = `${checkedCount} / ${sideQuestList.length}`;

  const handleNavigate = () => {

  }

  const handleToggleAccordion = () => {
    setisAccordion(prevState => !prevState);
  }

  return (
    <>
    <MainBoxContainer>
      <MainBoxStyle onClick={handleToggleAccordion}>
        <header className='aFContainer'>
          <button className='aButton'>{isAccordion ? (<MdArrowDropUp size={30} />) : (<MdArrowDropDown size={30} />)}</button>
          <p className='fDisplay'>{fraction}</p>
        </header>
        <h1 className='title'>{MainText}</h1>
        <button className='eButton' onClick={handleNavigate}><BsThreeDots /></button>
      </MainBoxStyle>
      <SideBoxContainer>
        {sideQuestList.map((quest, index) => (
          <SideBox
            key={index}
            isAccordion={isAccordion}
            checked={checked[index]}
            handleCheckboxClick={() => handleCheckboxClick(index)}
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
  gap: 10px;
  width: 100%;
  padding: 0px 10px;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const MainBoxStyle = styled.div`
  width: 90%;
  height: 55px;
  background: ${({ theme }) => theme.color.white};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.medium};

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  cursor: pointer;

  .aFContainer {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .title {
    width: 11rem;
  }

`;

const SideBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 90%;
  gap: 10px;
  margin-right: 11.7%;
`;

export default MainBox;