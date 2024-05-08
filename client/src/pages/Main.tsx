import Button from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import WeekCalander from '@/components/WeekCalander';
import styled from 'styled-components';
import UserProfile from '@/components/UserProfile';

const Main = () => {
  return (
    <MainStyle>
      <Dropdown />
      <WeekCalander />
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
