import styled from 'styled-components';
import { BsThreeDots } from "react-icons/bs";
import { subQuest } from '@/shared/dummy';


const SubBox = () => {
  const handleModal = () => {
    
  }
  return (
    <SubBoxStyle>
      <div className='title'>{subQuest[0].content}</div>
      <div className='ellipsis' onClick={handleModal}><BsThreeDots /></div>
    </SubBoxStyle>
  );
};

const SubBoxStyle = styled.div`
  width: 22rem;
  height: 55px;

  background: ${({ theme }) => theme.color.white};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.medium};

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  gap: 20px;

  margin-bottom: 5px;

  .ellipsis {
    cursor: pointer;
  }
`;

export default SubBox;