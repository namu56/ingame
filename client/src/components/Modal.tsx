import styled from 'styled-components';
import CloseButton from './CloseButton';
import { useRef } from 'react';

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  // 아직 handleOverLayClick 구현 전 : 헷갈린다... 
  // const modalRef = useRef<HTMLDivElement | null>(null);

  const handleClose = () => {
    onClose();
  }
  return (
    <>
      {isOpen && (
        <ModalStyle>
          <div className='modal-body'>  
            <CloseButton onClick={handleClose} />
            {children}
          </div>
        </ModalStyle>  
      )}
    </>
  );
};

const ModalStyle = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: ${({ theme }) => theme.color.white};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 1.25rem;

`;

export default Modal;