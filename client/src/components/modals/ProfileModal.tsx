import styled from 'styled-components';
import QuestInputBox from '../QuestInputBox';
import ProfileIntroInputBox from '../ProfileIntroInputBox';
import { FaUser } from 'react-icons/fa';
import { FaUserPen } from 'react-icons/fa6';
import Button from '../Button';

interface ProfileProps {}

const ProfileModal = () => {
  const nickname = '닉네임';
  const introduce = '자기 소개';

  const onClickHandler = () => {};

  return (
    <ProfileModalStyle>
      {/* <CloseButton onClick={}></CloseButton> */}
      <BoxStyle>
        <div className="box__title">
          <FaUser size={24} />
          <p className="title">닉네임변경</p>
        </div>
        <QuestInputBox placeholder={nickname} />
      </BoxStyle>
      <BoxStyle>
        <div className="box__title">
          <FaUserPen size={24} />
          <p className="title">자기소개 변경</p>
        </div>
        <ProfileIntroInputBox placeholder={introduce} />
      </BoxStyle>
      <ButtonContainerStyle>
        <Button size="medium" color="green" onClick={onClickHandler}>
          수정하기
        </Button>
      </ButtonContainerStyle>
    </ProfileModalStyle>
  );
};

const ProfileModalStyle = styled.div`
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

const BoxStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 10px;
  width: 100%;

  .box__title {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .title {
      font-family: 'Pretendard600';
    }
  }
`;

const ButtonContainerStyle = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  button {
    width: 100%;
  }
`;

export default ProfileModal;
