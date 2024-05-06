import Dropdown from '@/components/Dropdown';
import styled from 'styled-components';

const Main = () => {
  return (
    <MainStyle>
      <Dropdown />
    </MainStyle>
  );
};

const MainStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export default Main;
