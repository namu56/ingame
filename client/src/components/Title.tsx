import styled from 'styled-components';

interface TitleProps {
  text: string;
}

const Title = ({ text }: TitleProps) => {
  return (
    <TitleStyle>
      <h1>{text}</h1>
    </TitleStyle>
  );
};

const TitleStyle = styled.div`
  font-size: ${({ theme }) => theme.font.xlarge};
  font-family: 'Pretendard700';
  display: flex;
  justify-content: center;
`;

export default Title;
