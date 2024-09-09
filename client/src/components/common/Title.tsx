import styled from 'styled-components';

interface TitleProps {
  text: string;
  size: 'large' | 'medium' | 'small';
  color: 'blue' | 'black';
}

const Title = ({ text, size, color }: TitleProps) => {
  return (
    <TitleStyle size={size} color={color}>
      <h1>{text}</h1>
    </TitleStyle>
  );
};

const TitleStyle = styled.div<Omit<TitleProps, 'text'>>`
  font-size: ${({ theme, size }) => theme.font[size]};
  color: ${({ theme, color }) => theme.color[color]};
  font-family: 'Pretendard700';
  display: flex;
  justify-content: center;
`;

export default Title;
