import styled, { theme } from 'styled-components';
import { BsThreeDots } from 'react-icons/bs';
import { SubQuest } from '@/models/quest.model';

interface SubBoxProps {
  content: SubQuest;
}

const SubBox = ({ content }: SubBoxProps) => {
  const handleModal = () => {};
  return (
    <SubBoxStyle status={content.status}>
      <h2 className="title">{content.title}</h2>
      <button className="ellipsis" onClick={handleModal}>
        <BsThreeDots />
      </button>
    </SubBoxStyle>
  );
};

const SubBoxStyle = styled.div<{ status: keyof typeof theme.statusColor }>`
  width: 100%;
  height: 50px;

  background: ${({ theme, status }) => theme.statusColor[status]};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.medium};

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px 0px 20px;

  gap: 20px;

  margin-bottom: 5px;

  .ellipsis {
    cursor: pointer;
    background: none;
  }
`;

export default SubBox;
