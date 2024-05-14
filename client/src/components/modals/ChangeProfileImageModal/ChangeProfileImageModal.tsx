import styled from 'styled-components';
import { SetStateAction, useState } from 'react';
import CloseButton from '@/components/CloseButton';
import Title from '@/components/Title';
import ImageBadge from './ImageBadge/ImageBadge';
import { rabbit, defaultImage as defaultProfile, tiger, lion, cat } from '@/assets';
import Button from '@/components/Button';

interface ChangeProfileIamgeModalProps {
  isOpen?: boolean;
  handleProfileImage: React.Dispatch<SetStateAction<string>>;
  handleModal: React.Dispatch<SetStateAction<boolean>>;
  currentProfile: string | null;
}

const ChangeProfileImageModal = ({
  isOpen,
  handleProfileImage,
  handleModal,
  currentProfile,
}: ChangeProfileIamgeModalProps) => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(currentProfile);

  return (
    <ChangeProfileImageModalStyle>
      <CloseBtnWrapperStyle>
        <CloseButton onClick={() => handleModal(false)} />
      </CloseBtnWrapperStyle>
      <Title text="프로필 이미지 변경"></Title>
      <ProfileImageListStyle>
        <ImageBadge imgSrc={defaultProfile} value={null} checked={selectedProfile === null} />
        <ImageBadge imgSrc={tiger} value={null} checked={selectedProfile === 'tiger'} />
        <ImageBadge imgSrc={cat} value={null} checked={selectedProfile === 'cat'} />
        <ImageBadge imgSrc={rabbit} value={null} checked={selectedProfile === 'rabbit'} />
        <ImageBadge imgSrc={lion} value={null} checked={selectedProfile === 'lion'} />
      </ProfileImageListStyle>
      <ButtonsStyle>
        <Button size="large" color="green">
          변경하기
        </Button>
        <Button size="large" color="grayNormalActive">
          닫기
        </Button>
      </ButtonsStyle>
    </ChangeProfileImageModalStyle>
  );
};

const ChangeProfileImageModalStyle = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: ${({ theme }) => theme.color.white};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 1.25rem;
`;

const CloseBtnWrapperStyle = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

const ProfileImageListStyle = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ButtonsStyle = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 1rem;

  button {
    width: 50%;
  }
`;
export default ChangeProfileImageModal;
