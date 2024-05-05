import styled from 'styled-components';
import CloseButton from '../CloseButton';
import QuestInputBox from '../QuestInputBox';
import ProfileIntroInputBox from '../ProfileIntroInputBox';
import { FaUser } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import Button from '../Button';

const Profile = () => {
  // 받아온 닉네임
  // 이렇게 되면 profile모달을 열 때 main에서 닉네임을 받아와야 한다.
  const nickname = '닉네임';
  const introduce = '자기 소개';

  const onClickHandler = () => {

  }

  return (
    <ProfileStyle>
      <div className='container'>
        <CloseButton />
        <div className='userNameContainer'>
          <div><FaUser /></div>
          <h1>닉네임 변경</h1>
        </div>
        <QuestInputBox placeholder={nickname} />
        <div className='userIntroContainer'>
          <div><FaUserPen /></div>
          <h1>자기소개 변경</h1>
        </div>
        <ProfileIntroInputBox placeholder={introduce} />
        <div className='editButtonContainer'>
          <Button size="medium" color="green" onClick={onClickHandler}>수정하기</Button>
        </div>
      </div>          
    </ProfileStyle>
  );
};

const ProfileStyle = styled.div`

  .container { 
    width: 18.75rem;
    height: 28rem;
    border: 1px solid ${({ theme }) => theme.color.black};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    padding: 1.25rem ;
  }
  
  .userNameContainer,
  .userIntroContainer {
    display: flex;
    align-items: center;

    gap: 10px;
    margin-bottom: 10px;
  }

  .editButtonContainer {
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
  }
`;

export default Profile;
