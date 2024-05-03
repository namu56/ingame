import styled from 'styled-components';
import { GiHamburgerMenu } from "react-icons/gi";



const Hamberger = () => {
  return (
    <>
      <HambergerStyle><GiHamburgerMenu /></HambergerStyle>  
    </>
  );
};

const HambergerStyle = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: ${({ theme }) => theme.font.large};
`;

export default Hamberger;