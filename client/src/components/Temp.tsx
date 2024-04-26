import styled from 'styled-components';

const Temp = () => {
  return (
    <TempStyle>
      <h1>Tempsd</h1>
    </TempStyle>
  );
};

const TempStyle = styled.div`
  font-size: ${({ theme }) => theme.font.medium};
  font-family: 'Pretendard700';
`;

export default Temp;
