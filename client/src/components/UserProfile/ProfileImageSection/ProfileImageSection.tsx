import styled from 'styled-components';
import Camera from '@/assets/images/camera.svg';
import { useState } from 'react';
import useOutsideClick from '@/hooks/useOutsideClick';
import ChangeProfileImageModal from '@/components/modals/ChangeProfileImageModal/ChangeProfileImageModal';
import { rabbit, defaultImage as defaultProfile, tiger, lion, cat } from '@/assets';

interface ProfileImageSecitonProps {
  profilePhoto?: string;
}

const ProfileImageSection = ({ profilePhoto = 'null' }: ProfileImageSecitonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const ChangeProfileImageModalRef = useOutsideClick<HTMLDivElement>(isOpen, () =>
    setIsOpen(false)
  );

  return (
    <>
      <ProfileImageSectionStyle ref={ChangeProfileImageModalRef}>
        <div className="profile__img" onClick={() => setIsOpen(!isOpen)}>
          <img
            src={
              profilePhoto === 'cat'
                ? cat
                : profilePhoto === 'lion'
                  ? lion
                  : profilePhoto === 'rabbit'
                    ? rabbit
                    : profilePhoto === 'tiger'
                      ? tiger
                      : defaultProfile
            }
            alt="default"
          />
          <img className="camera" src={Camera} alt="camera" />
        </div>
        {isOpen && (
          <ChangeProfileImageModal currentProfile={profilePhoto} handleModal={setIsOpen} />
        )}
      </ProfileImageSectionStyle>
    </>
  );
};

const ProfileImageSectionStyle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 90px;
  padding: 10px;
  border-radius: ${({ theme }) => theme.borderRadius.xlarge};
  background-color: ${({ theme }) => theme.color.greenLight};

  &:hover {
    background-color: ${({ theme }) => theme.color.greenLightActive};
  }

  .profile__img {
    display: flex;
    align-items: center;
    position: relative;
    width: 70px;
    height: 70px;

    &:hover {
      cursor: pointer;
    }

    .camera {
      position: absolute;
      padding: 5px;
      background-color: ${({ theme }) => theme.color.grayDark};
      border-radius: ${({ theme }) => theme.borderRadius.xlarge};
      bottom: 0;
      right: 0;
    }
  }
`;

export default ProfileImageSection;
