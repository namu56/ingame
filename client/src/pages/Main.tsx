import Dropdown from '@/components/Dropdown';
import styled from 'styled-components';
import UserProfile from '@/components/UserProfile/UserProfile';

const Main = () => {
  return (
    <MainStyle>
      <Dropdown />
      <UserProfile />
    </MainStyle>
  );
};

const MainStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`;

export default Main;
