import styled from 'styled-components';

const Title = () => {
  return (
    <TitleStyle>
      <h1>InGame</h1>
    </TitleStyle>
  );
};

const TitleStyle = styled.div`
  font-size: ${({ theme }) => theme.font.xlarge};
  font-family: 'Pretendard700';
`;

export default Title;
