import styled from 'styled-components';
import useOutsideClick from '@/hooks/useOutsideClick';
import { useState } from 'react';
import { GrAddCircle } from 'react-icons/gr';
import CreateSubQuestModal from './modals/CreateSubQuestModal';

interface CreateSubQuestModalProps {
  isOpen?: boolean;
}

const CreateSubQuestButton = ({ isOpen = false }: CreateSubQuestModalProps) => {
  const [open, setOpen] = useState(isOpen);
  const createSubQuestModalRef = useOutsideClick<HTMLDivElement>(open, () => setOpen(false));
  return (
    <CreateSubQuestButtonStyle $open={open} ref={createSubQuestModalRef}>
      <button onClick={() => setOpen(!open)} className="createBtn">
        <GrAddCircle />
      </button>
      {open && <CreateSubQuestModal onClose={() => setOpen(false)} />}
    </CreateSubQuestButtonStyle>
  );
};

const CreateSubQuestButtonStyle = styled.div<{ $open: boolean }>`
  padding-top: 0.2rem;

  .createBtn {
    background: none;
    cursor: pointer;
  }
`;

export default CreateSubQuestButton;
