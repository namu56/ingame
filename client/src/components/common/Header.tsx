import styled from 'styled-components';
import Title from './Title';
import Logo from '@/assets/images/logo.png';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <HeaderStyle>
      <LogoImage src={Logo} alt="InGame Logo" />
      <Title text={title} size="medium" color="blue" />
    </HeaderStyle>
  );
};

const HeaderStyle = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
`;

const LogoImage = styled.img`
  width: ${({ theme }) => theme.font.xlarge};
  height: ${({ theme }) => theme.font.xlarge};
  margin-right: 10px;
  border-radius: 5px;
`;

export default Header;
