import styled from 'styled-components';
import { BsThreeDots } from "react-icons/bs";
import { MdArrowDropDown } from "react-icons/md";
import { MdArrowDropUp } from "react-icons/md";
import { useState } from 'react';
import SubBox from './SubBox';

const sideQuestList = [
  {
    content: '사이드 퀘스트 1',
    status: 0
  },
  {
    content: '사이드 퀘스트 2',
    status: 0
  },
  {
    content: '사이드 퀘스트 3',
    status: 0
  }
];

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
      <MainBoxStyle onClick={handleToggleAccordion}>
        <div className='aFContainer'>
          <div className='aButton'>{isAccordion ? (<MdArrowDropUp size={30} />) : (<MdArrowDropDown size={30} />)}</div>
          <div className='fDisplay'>{fraction}</div>
        </div>
        <div className='title'>{MainText}</div>
        <div className='eButton' onClick={handleNavigate}><BsThreeDots /></div>
      </MainBoxStyle>
      {sideQuestList.map((quest, index) => (
        <SideBoxStyle key={index} className={`sideBox ${isAccordion ? 'show' : ''}`}>
          <div className='cBox'>
            <input type='checkbox' checked={checked[index]} onChange={() => handleCheckboxClick(index)} />
          </div>
          <div className='sTitle'>{quest.content}</div>
        </SideBoxStyle>
      ))}
  </>
  );
};

const MainBoxStyle = styled.div`
  width: 22rem;
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

const SideBoxStyle = styled.div`
  position: relative;
  left: 23px;
  margin-top: 5px;

  display: flex;
  align-items: center;
  padding: 0px 10px;
  width: 20.5rem;
  height: 55px;
  background: ${({ theme }) => theme.color.white};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  gap: 20px;

  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  transform: translateY(-100%);
  max-height: 0;
  overflow: hidden;
  opacity: 0;

  &.show {
    transform: translateY(0%);
    max-height: 100%;
    opacity: 1;
  }

  .cBox {
    cursor: pointer;
  }
`;

export default MainBox;