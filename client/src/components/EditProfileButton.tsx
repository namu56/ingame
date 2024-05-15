import styled from 'styled-components';
import edit from '../assets/images/edit.png';
import useOutsideClick from '@/hooks/useOutsideClick';
import { useState } from 'react';
import ProfileModal from './modals/ProfileModal';

interface EditProfileButtonProps {
  isOpen?: boolean;
  nickname: string;
  intro: string | null;
}

const EditProfileButton = ({ isOpen = false, nickname, intro }: EditProfileButtonProps) => {
  const [open, setOpen] = useState(isOpen);
  const editProfileModalRef = useOutsideClick<HTMLDivElement>(open, () => setOpen(false));
  return (
    <EditProfileButtonStyle $open={open} ref={editProfileModalRef}>
      <button onClick={() => setOpen(!open)}>
        <img src={edit} alt="edit" />
      </button>
      {open && <ProfileModal OriginNickname={nickname} OriginIntro={intro} onClose={() => setOpen(false)} />}
    </EditProfileButtonStyle>
  );
};

const EditProfileButtonStyle = styled.div<{ $open: boolean }>`
  padding-top: 0.2rem;
`;

export default EditProfileButton;
