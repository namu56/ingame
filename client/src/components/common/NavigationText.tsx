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
  font-size: ${({ theme }) => theme.font.xsmall};
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.color.blue};
  text-underline-offset: 3px;

  a {
    cursor: pointer;
    color: ${({ theme }) => theme.color.blue};
  }

  a:visited {
    color: ${({ theme }) => theme.color.blue};
  }

  a:hover {
    color: ${({ theme }) => theme.colorActive.blue};
  }
`;

export default NavigationText;
