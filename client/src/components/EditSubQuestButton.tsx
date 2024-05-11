import styled from 'styled-components';
import useOutsideClick from '@/hooks/useOutsideClick';
import { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import SubQuestModal from './modals/SubQuestModal';
import { QuestHiddenType } from '@/models/quest.model';

interface EditSubQuestButtonProps {
  isOpen?: boolean;
  id: number;
  title: string;
  hidden: QuestHiddenType;
}

const EditSubQuestButton = ({ isOpen = false, id, title, hidden }: EditSubQuestButtonProps) => {
  const [open, setOpen] = useState(isOpen);
  const editSubQuestModalRef = useOutsideClick<HTMLDivElement>(open, () => setOpen(false));
  return (
    <EditSubQuestButtonStyle $open={open} ref={editSubQuestModalRef}>
      <button onClick={() => setOpen(!open)} className="EditBtn">
        <BsThreeDots />
      </button>
      {open && (
        <SubQuestModal
          OriginTitle={title}
          id={id}
          OriginHidden={hidden}
          onClose={() => setOpen(false)}
        />
      )}
    </EditSubQuestButtonStyle>
  );
};

const EditSubQuestButtonStyle = styled.div<{ $open: boolean }>`
  padding-top: 0.2rem;

  .EditBtn {
    background: none;
    cursor: pointer;
  }
`;

export default EditSubQuestButton;
