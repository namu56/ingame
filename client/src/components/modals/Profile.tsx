import styled from 'styled-components';
import QuestInputBox from '../QuestInputBox';
import ProfileIntroInputBox from '../ProfileIntroInputBox';
import { FaUser } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import Button from '../Button';

const Profile = () => {
  const nickname = '닉네임';
  const introduce = '자기 소개';

  const onClickHandler = () => {

  };

  return (
    <ProfileStyle>
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
    </ProfileStyle>
  );
};

const ProfileStyle = styled.div`
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
