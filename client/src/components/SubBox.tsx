import styled from 'styled-components';
import { QuestStatus, SubQuest } from '@/models/quest.model';
import EditSubQuestButton from './EditSubQuestButton';
import { useQuest } from '@/hooks/useQuest';
import { useMessage } from '@/hooks/useMessage';
import { formattedCalendar } from '@/utils/formatter';

interface SubBoxProps {
  content: SubQuest;
}

const SubBox = ({ content }: SubBoxProps) => {
  const { modifySubQuestStatus, date } = useQuest();
  const { showConfirm, showAlert } = useMessage();

  const handleChangeStatue = () => {
    if (date === formattedCalendar(new Date())) {
      let message = '';
      if (content.status === 'on_progress') {
        message = '퀘스트를 완료하시겠습니까?';
      } else if (content.status === 'completed') {
        message = '퀘스트를 진행중으로 변경하시겠습니까?';
      } else {
        return;
      }

      showConfirm(message, () => {
        modifySubQuestStatus({ id: content.id, status: content.status });
      });
    } else {
      showAlert('당일 퀘스트만 수정 가능합니다');
    }
  };

  return (
    <SubBoxStyle status={content.status} onClick={handleChangeStatue}>
      <h2 className="title">{content.title}</h2>
      <EditSubQuestButton title={content.title} id={content.id} hidden={content.hidden} />
    </SubBoxStyle>
  );
};

const SubBoxStyle = styled.div<{ status: QuestStatus }>`
  width: 100%;
  height: 50px;

  background: ${({ theme, status }) => theme.statusColor[status]};
  color: ${({ theme, status }) => status !== 'on_progress' && theme.color.grayDarkActive};
  text-decoration: ${({ status }) => status !== 'on_progress' && 'line-through'};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.medium};

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px 0px 20px;

  gap: 20px;

  margin-bottom: 5px;
`;

export default SubBox;
