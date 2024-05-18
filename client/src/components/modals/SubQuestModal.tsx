import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import QuestInputBox from '../QuestInputBox';
import Button from '../Button';
import CloseButton from '../CloseButton';
import edit from '../../assets/images/edit.png';
import { TfiUnlock, TfiLock } from 'react-icons/tfi';
import { useEffect, useState } from 'react';
import { QuestHiddenType } from '@/models/quest.model';
import { useSubQuest } from '@/hooks/useSubQuest';

export interface SubQuestModifyProps {
  title: string;
  id: number;
  hidden: QuestHiddenType;
}

interface SubQuestModalProps {
  onClose: () => void;
  OriginTitle: string;
  id: number;
  OriginHidden: QuestHiddenType;
}

const SubQuestModal = ({ onClose, OriginTitle, id, OriginHidden }: SubQuestModalProps) => {
  const [title, setTitle] = useState(OriginTitle);
  const [hidden, setHidden] = useState(OriginHidden);

  const { register, handleSubmit, setValue } = useForm<SubQuestModifyProps>();

  const { modifySubQuest } = useSubQuest();

  const onSubmit = (data: SubQuestModifyProps) => {
    modifySubQuest(data).then(() => {
      onClose();
    });
  };

  useEffect(() => {
    setValue('hidden', hidden);
  }, [hidden, setValue]);

  return (
    <SubQuestModalStyle>
      <CloseButton onClick={onClose}></CloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" value={id} {...register('id')} />
        <BoxStyle>
          <div className="box__title">
            <img src={edit} alt="edit" />
            <p className="title">서브 퀘스트</p>
          </div>
          <SubQuestInputStyle
            value={title}
            {...register('title', { required: true })}
            onChange={(e) => setTitle(e.target.value)}
          />
        </BoxStyle>
        <BoxStyle $hidden={hidden}>
          <div className="box__title">
            <img src={edit} alt="edit" />
            <p className="title">퀘스트 숨기기</p>
          </div>
          <div className="boxHidden">
            <span onClick={() => setHidden(hidden === 'TRUE' ? 'FALSE' : 'TRUE')}>
              {hidden === 'TRUE' ? <TfiLock size={30} /> : <TfiUnlock size={30} />}
            </span>
          </div>
        </BoxStyle>
        <ButtonContainerStyle>
          <Button type="submit" size="medium" color="green" children={'수정하기'} />
          <Button onClick={onClose} size="medium" color="grayNormal" children={'닫기'} />
        </ButtonContainerStyle>
      </form>
    </SubQuestModalStyle>
  );
};

interface BoxStyleProps {
  $hidden?: QuestHiddenType;
}

const SubQuestModalStyle = styled.div`
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

const BoxStyle = styled.div<BoxStyleProps>`
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

  .boxHidden {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      cursor: pointer;
      fill: ${({ theme, $hidden }) =>
        $hidden === 'TRUE' ? theme.color.green : theme.color.grayDark};
    }
  }
`;

const SubQuestInputStyle = styled(QuestInputBox)`
  color: ${({ theme }) => theme.color.black};
`;

const ButtonContainerStyle = styled.div`
  padding: 0.75rem;
  display: flex;
  justify-content: center;
  width: 100%;
  button {
    width: 100%;
  }
  gap: 1.5rem;
`;

export default SubQuestModal;
