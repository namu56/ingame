import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import QuestInputBox from '../quests/QuestInputBox';
import ProfileIntroInputBox from '../UserProfile/ProfileIntroInputBox';
import { FaUser } from 'react-icons/fa';
import { FaUserPen } from 'react-icons/fa6';
import Button from '../common/Button';
import CloseButton from '../common/CloseButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchUserProfile } from '@/api/users.api';
import { useState } from 'react';
import { USER } from '@/constant/queryKey';

interface ProfileModifyProps {
  nickname: string;
  intro: string | null;
}

interface ProfileProps {
  onClose: () => void;
  OriginNickname: string;
  OriginIntro: string | null;
}

const ProfileModal = ({ onClose, OriginNickname, OriginIntro }: ProfileProps) => {
  const [nickname, setNickname] = useState(OriginNickname);
  const [intro, setIntro] = useState(OriginIntro);
  const [inputCount, setInputCount] = useState<number>(
    OriginIntro === null ? 0 : OriginIntro.length
  );
  const [, setprofileIntro] = useState(intro);
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm<ProfileModifyProps>();

  const onSubmit = (data: ProfileModifyProps) => {
    ProfileMutation.mutate(data);
  };

  const ProfileMutation = useMutation({
    mutationFn: patchUserProfile,
    onSuccess(res) {
      queryClient.invalidateQueries({
        queryKey: [...USER.GET_USERINFO],
      });
      onClose();
    },
    onError(err) {
      onClose();
    },
  });

  return (
    <ProfileModalStyle>
      <CloseButton onClick={onClose}></CloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <BoxStyle>
          <div className="box__title">
            <FaUser size={24} />
            <p className="title">닉네임변경</p>
          </div>
          <QuestInputBox
            placeholder={nickname}
            value={nickname}
            {...register('nickname', { required: true, maxLength: 20 })}
            onChange={(e) => setNickname(e.target.value)}
          />
        </BoxStyle>
        <BoxStyle>
          <div className="box__title">
            <FaUserPen size={24} />
            <p className="title">자기소개 변경</p>
          </div>
          <ProfileIntroInputBox
            placeholder={intro === null ? '' : intro}
            value={intro === null ? '' : intro}
            inputCount={inputCount}
            {...register('intro')}
            onChange={(e) => {
              setIntro(e.target.value);
              setInputCount(e.target.value.length);
              setprofileIntro(e.target.value);
            }}
          />
        </BoxStyle>
        <ButtonContainerStyle>
          <Button size="medium" color="green" children={'수정하기'} />
        </ButtonContainerStyle>
      </form>
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

  form {
    width: 100%;
  }
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
