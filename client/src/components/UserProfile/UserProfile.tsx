import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { USER } from '@/constant/queryKey';
import { getUserInfo } from '@/api/users.api';
import EditProfileButton from '../EditProfileButton';
import ProgressBar from '../ProgressBar';
import { media } from '@/styles/theme';
import ProfileImageSection from './ProfileImageSection/ProfileImageSection';

const UserProfile = () => {
  const { data: userInfo } = useQuery({
    queryKey: [...USER.GET_USERINFO],
    queryFn: () => getUserInfo(),
  });

  return (
    <UserProfileStyle>
      {userInfo && (
        <UserInfoStyle>
          <ProfileImageSection profilePhoto={userInfo.profilePhoto} />
          <UserDetailInfoStyle>
            <div className="basic__info">
              <p className="nickname">
                Lv {userInfo.level} {userInfo.nickname}
              </p>
              <EditProfileButton nickname={userInfo.nickname} intro={userInfo.intro} />
            </div>
            <div className="progress__bar">
              <ProgressBar point={userInfo.point} />
            </div>
            <span className="introduction">{userInfo.intro}</span>
          </UserDetailInfoStyle>
        </UserInfoStyle>
      )}
    </UserProfileStyle>
  );
};

const UserProfileStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.font.medium};
`;

const UserInfoStyle = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
`;

const UserDetailInfoStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 308px;

  ${media.mobile} {
    width: calc(100vw - 170px);
  }

  .basic__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0.3rem;
    gap: 1rem;
    width: 100%;

    .nickname {
      width: 100%;
      white-space: nowrap;
    }
  }

  .progress__bar {
    width: 100%;
  }

  .introduction {
    width: 100%;
    font-size: ${({ theme }) => theme.font.small};
    font-family: 'Pretenard700';
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default UserProfile;
