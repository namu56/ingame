import styled from 'styled-components';
import { GrAddCircle } from 'react-icons/gr';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateSubQuestModal from './modals/CreateSubQuestModal';
import useOutsideClick from '@/hooks/useOutsideClick';

interface CreateQuestButtonProps {
  isOpen?: boolean;
  pageUrl?: string;
  modalName?: string;
}

const QuestCreateButton = ({ isOpen = false, pageUrl, modalName }: CreateQuestButtonProps) => {
  const [open, setOpen] = useState(isOpen);
  const createQuestModalRef = useOutsideClick<HTMLDivElement>(open, () => setOpen(false));
  const navigate = useNavigate();
  const handleOpen = () => {
    if (pageUrl) {
      navigate(pageUrl);
    } else {
      setOpen(!open);
    }
  };

  let ModalComponent;
  switch (modalName) {
    case 'subQuest':
      ModalComponent = CreateSubQuestModal;
      break;
    default:
      ModalComponent = null;
  }

  return (
    <QuestCreateButtonStyle ref={createQuestModalRef}>
      <button onClick={handleOpen} className="createBtn">
        <GrAddCircle />
      </button>
      {open && ModalComponent && <ModalComponent onClose={() => setOpen(false)} />}
    </QuestCreateButtonStyle>
  );
};

const QuestCreateButtonStyle = styled.div`
  padding-top: 0.2rem;

  .createBtn {
    background: none;
    cursor: pointer;
  }
`;

export default QuestCreateButton;
