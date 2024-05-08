import styled from 'styled-components';
import Camera from '@/assets/images/camera.svg';
import { useState } from 'react';
import useOutsideClick from '@/hooks/useOutsideClick';
import ChangeProfileImageModal from '@/components/modals/ChangeProfileImageModal';
import { rabbit, defaultImage as defaultProfile, tiger, lion, cat } from '@/assets';

interface ProfileImageSecitonProps {
  profilePhoto?: string;
}

const ProfileImageSection = ({ profilePhoto = 'defaultImage' }: ProfileImageSecitonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ChangeProfileImageModalRef = useOutsideClick<HTMLDivElement>(isOpen, () =>
    setIsOpen(false)
  );

  const [profileImage, setProfileImage] = useState(profilePhoto);

  console.log(profileImage);

  return (
    <>
      <ProfileImageSectionStyle ref={ChangeProfileImageModalRef}>
        <div className="profileImage" onClick={() => setIsOpen(!isOpen)}>
          <img
            src={
              profileImage === 'cat'
                ? cat
                : profileImage === 'lion'
                  ? lion
                  : profileImage === 'rabbit'
                    ? rabbit
                    : profileImage === 'tiger'
                      ? tiger
                      : defaultProfile
            }
            alt="default"
          />
          <img className="camera" src={Camera} alt="camera" />
        </div>
      </ProfileImageSectionStyle>
      {isOpen && <ChangeProfileImageModal />}
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

  .profileImage {
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
