import styled from 'styled-components';
import { QuestStatus, SubQuest } from '@/models/quest.model';
import { useSubQuest } from '@/hooks/useSubQuest';
import { useMessage } from '@/hooks/useMessage';
import { formattedDate } from '@/utils/formatter';
import { BsThreeDots } from 'react-icons/bs';
import SubQuestModal from '../modals/SubQuestModal';
import { useState } from 'react';

interface SubBoxProps {
  content: SubQuest;
}

const SubBox = ({ content }: SubBoxProps) => {
  const { modifySubQuestStatus, date } = useSubQuest();
  const { showConfirm, showAlert } = useMessage();
  const [open, setOpen] = useState(false);

  const handleChangeStatue = () => {
    if (date === formattedDate(new Date())) {
      let message = '';
      let status = content.status;
      if (content.status === 'ON_PROGRESS') {
        message = '퀘스트를 완료하시겠습니까?';
        status = 'COMPLETED';
      } else if (content.status === 'COMPLETED') {
        message = '퀘스트를 진행중으로 변경하시겠습니까?';
        status = 'ON_PROGRESS';
      } else {
        return;
      }

      showConfirm(message, () => {
        modifySubQuestStatus({ id: content.id, status: status });
      });
    } else {
      showAlert('당일 퀘스트만 변경 가능합니다');
    }
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpen(!open);
  };

  return (
    <SubBoxStyle status={content.status}>
      <div onClick={handleChangeStatue} className="clickDiv">
        <h2>{content.title}</h2>
        <button onClick={handleEdit} className="EditBtn">
          <BsThreeDots />
        </button>
      </div>
      {open && (
        <SubQuestModal
          OriginTitle={content.title}
          id={content.id}
          OriginHidden={content.hidden}
          onClose={() => setOpen(false)}
        />
      )}
    </SubBoxStyle>
  );
};

const SubBoxStyle = styled.div<{ status: QuestStatus }>`
  width: 100%;
  height: 50px;

  background: ${({ theme, status }) => theme.statusColor[status]};
  color: ${({ theme, status }) => status !== 'ON_PROGRESS' && theme.color.grayDark};
  text-decoration: ${({ status }) => status !== 'ON_PROGRESS' && 'line-through'};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.medium};

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px 0px 20px;

  gap: 20px;

  margin-bottom: 5px;

  .clickDiv {
    width: 100%;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    align-items: center;

    .EditBtn {
      background: none;
      cursor: pointer;
    }
  }
`;

export default SubBox;
