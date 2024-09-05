import styled from 'styled-components';

interface TitleProps {
  text: string;
  size: 'large' | 'medium' | 'small';
}

const Title = ({ text, size }: TitleProps) => {
  return (
    <TitleStyle size={size}>
      <h1>{text}</h1>
    </TitleStyle>
  );
};

const TitleStyle = styled.div<Pick<TitleProps, 'size'>>`
  font-size: ${({ theme, size }) => theme.font[size]};
  color: ${({ theme }) => theme.color.blue};
  font-family: 'Pretendard700';
  display: flex;
  justify-content: center;
`;

export default Title;
