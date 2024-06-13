import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface NavigationTextProps {
  text: string;
  url: string;
}

const NavigationText = ({ text, url }: NavigationTextProps) => {
  return (
    <NavigationTextStyle>
      <Link to={url}>{text}</Link>
    </NavigationTextStyle>
  );
};

const NavigationTextStyle = styled.div`
  display: flex;
  justify-content: center;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);

  a {
    cursor: pointer;
    color: ${({ theme }) => theme.color.blue};
  }

  a:visited {
    color: ${({ theme }) => theme.color.blue};
  }
`;

export default NavigationText;
