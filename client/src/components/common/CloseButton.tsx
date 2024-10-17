import styled from 'styled-components';
import { IoIosCloseCircleOutline } from 'react-icons/io';

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton = ({ onClick }: CloseButtonProps) => {
  return (
    <CloseButtonStyle>
      <IoIosCloseCircleOutline color="black" className="closeIcon" onClick={onClick} />
    </CloseButtonStyle>
  );
};

const CloseButtonStyle = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  font-size: ${({ theme }) => theme.font.large};

  border: none;
  background-color: transparent;

  .closeIcon {
    cursor: pointer;
  }
`;

export default CloseButton;
