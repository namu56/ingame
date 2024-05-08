import styled from 'styled-components';

interface ChangeProfileIamgeModalProps {
  isOpen?: boolean;
}

const ChangeProfileImageModal = ({ isOpen }: ChangeProfileIamgeModalProps) => {
  return <ChangeProfileImageModalStyle>1212</ChangeProfileImageModalStyle>;
};

const ChangeProfileImageModalStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  position: absolute;
  width: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: ${({ theme }) => theme.color.white};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 2rem;
`;

// const BoxStyle = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.75rem;
//   margin-bottom: 10px;
//   width: 100%;

//   .box__title {
//     display: flex;
//     align-items: center;
//     gap: 0.5rem;

//     .title {
//       font-family: 'Pretendard600';
//     }
//   }
// `;

// const ButtonContainerStyle = styled.div`
//   display: flex;
//   justify-content: center;
//   width: 100%;
//   button {
//     width: 100%;
//   }
// `;

export default ChangeProfileImageModal;
