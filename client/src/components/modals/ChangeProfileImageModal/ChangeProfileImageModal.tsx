import styled from 'styled-components';
import { SetStateAction, useState } from 'react';
import CloseButton from '@/components/CloseButton';
import Title from '@/components/Title';
import ImageBadge from './ImageBadge/ImageBadge';
import { rabbit, defaultImage as defaultProfile, tiger, lion, cat } from '@/assets';
import Button from '@/components/Button';
import { useChangeProfilePhotoMutation } from '@/hooks/useProfile';

interface ChangeProfileIamgeModalProps {
  isOpen?: boolean;
  handleModal: React.Dispatch<SetStateAction<boolean>>;
  currentProfile: string | null;
}

const ChangeProfileImageModal = ({ handleModal, currentProfile }: ChangeProfileIamgeModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(currentProfile);
  const { mutate: changeProfilePhotoMutate } = useChangeProfilePhotoMutation();

  return (
    <ChangeProfileImageModalStyle>
      <CloseBtnWrapperStyle>
        <CloseButton onClick={() => handleModal(false)} />
      </CloseBtnWrapperStyle>
      <Title text="프로필 이미지 변경"></Title>
      <ProfileImageListStyle>
        <ImageBadge
          imgSrc={defaultProfile}
          value={null}
          checked={selectedImage === null}
          handleSelectedImage={setSelectedImage}
        />
        <ImageBadge
          imgSrc={tiger}
          value={'tiger'}
          checked={selectedImage === 'tiger'}
          handleSelectedImage={setSelectedImage}
        />
        <ImageBadge
          imgSrc={cat}
          value={'cat'}
          checked={selectedImage === 'cat'}
          handleSelectedImage={setSelectedImage}
        />
        <ImageBadge
          imgSrc={rabbit}
          value={'rabbit'}
          checked={selectedImage === 'rabbit'}
          handleSelectedImage={setSelectedImage}
        />
        <ImageBadge
          imgSrc={lion}
          value={'lion'}
          checked={selectedImage === 'lion'}
          handleSelectedImage={setSelectedImage}
        />
      </ProfileImageListStyle>
      <ButtonsStyle>
        <Button
          size="large"
          color="green"
          onClick={() => {
            changeProfilePhotoMutate({ profilePhoto: selectedImage });
            handleModal(false);
          }}
        >
          변경하기
        </Button>
        <Button size="large" color="grayNormal" onClick={() => handleModal(false)}>
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
  width: 100%;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;

  padding: 0.5rem 0;
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
