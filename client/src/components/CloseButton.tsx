import styled from 'styled-components';
import { IoIosCloseCircleOutline } from "react-icons/io";


const CloseButton = () => {
  return (
    <>
      <CloseButtonStyle><IoIosCloseCircleOutline /></CloseButtonStyle>  
    </>
  );
};

const CloseButtonStyle = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: ${({ theme }) => theme.font.large};
`;

export default CloseButton;