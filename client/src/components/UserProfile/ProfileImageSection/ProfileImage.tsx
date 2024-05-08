import styled from 'styled-components';
import defaultProfile from '@/assets/images/avatar.png';
import Camera from '@/assets/images/camera.svg';

const ProfileImageSection = () => {
  return (
    <ProfileImageSectionStyle>
      <div className="profileImage">
        <img src={defaultProfile} alt="default" />
        <img className="camera" src={Camera} alt="camera" />
      </div>
    </ProfileImageSectionStyle>
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
    cursor: pointer;
    background-color: ${({ theme }) => theme.color.greenLightActive};
  }

  .profileImage {
    display: flex;
    align-items: center;
    position: relative;
    width: 70px;
    height: 70px;

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
