import Dropdown from '@/components/Dropdown';
import WeekCalander from '@/components/WeekCalander';
import styled from 'styled-components';

const Main = () => {
  return (
    <MainStyle>
      <Dropdown />
      <WeekCalander />
    </MainStyle>
  );
};

const MainStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export default Main;
