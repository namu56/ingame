import styled from 'styled-components';
import edit from '../assets/images/edit.png';
import useOutsideClick from '@/hooks/useOutsideClick';
import { useState } from 'react';

interface EditProfileButtonProps {}

const EditProfileButton = ({}: EditProfileButtonProps) => {
  const [open, setOpen] = useState(false);
  const editProfileModalRef = useOutsideClick<HTMLDivElement>(open, () => setOpen(false));
  return (
    <EditProfileButtonStyle $open={open} ref={editProfileModalRef}>
      <button>
        <img src={edit} alt="edit" />
      </button>
    </EditProfileButtonStyle>
  );
};

const EditProfileButtonStyle = styled.div<{ $open: boolean }>`
  padding-top: 0.2rem;
`;

export default EditProfileButton;
