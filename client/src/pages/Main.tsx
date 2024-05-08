import Dropdown from '@/components/Dropdown';
import styled from 'styled-components';
import UserProfile from '@/components/UserProfile';
import SubBox from '@/components/SubBox';
import WeekCalendar from '@/components/WeekCalendar';
import { useQuest } from '@/hooks/useQuest';

const Main = () => {
  const { quest } = useQuest();
  return (
    <MainStyle>
      <Dropdown />
      <WeekCalendar />
      <UserProfile />
      <SubBox />
    </MainStyle>
  );
};

const MainStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

export default Main;
