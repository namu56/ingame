import styled from 'styled-components';
import defaultProfile from '../assets/images/Profile-PNG-File.png';
import { useQuery } from '@tanstack/react-query';
import { USER } from '@/constant/queryKey';
import { getUserInfo } from '@/api/users.api';

const UserProfile = () => {
  const { data: userInfo } = useQuery({
    queryKey: [...USER.GET_USERINFO],
    queryFn: () => getUserInfo(),
  });
  console.log(userInfo);
  return (
    <UserProfileStyle>
      <UserImageStyle>
        <img src={defaultProfile} alt="profileImage" />
      </UserImageStyle>
      <UserInfoStyle>
        <p className="nickname"></p>
        <div className="point"></div>
        <div className="introduction"></div>
      </UserInfoStyle>
    </UserProfileStyle>
  );
};

const UserProfileStyle = styled.div`
  display: flex;
`;

const UserImageStyle = styled.div`
  padding: 0.5rem 1rem;
  img {
    width: 70px;
    height: 70px;
  }
`;

const UserInfoStyle = styled.div`
  display: flex;
  gap: 1rem;
`;

export default UserProfile;
