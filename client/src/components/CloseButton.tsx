import styled from 'styled-components';
import { GiHamburgerMenu } from "react-icons/gi";

const CloseButton = () => {
  return (
    <>
      <CloseButtonStyle><GiHamburgerMenu /></CloseButtonStyle>  
    </>
  );
};

const CloseButtonStyle = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: ${({ theme }) => theme.font.large};
`;

export default CloseButton;