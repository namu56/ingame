import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import QuestInputBox from '../QuestInputBox';
import Button from '../Button';
import CloseButton from '../CloseButton';
import edit from '../../assets/images/edit.png';
import { TfiUnlock, TfiLock } from 'react-icons/tfi';
import { useEffect, useState } from 'react';
import { QuestHiddenType, QuestMode } from '@/models/quest.model';
import { useSubQuest } from '@/hooks/useSubQuest';
import { formattedCalendar } from '@/utils/formatter';

export interface CreateSubQuestProps {
  title: string;
  hidden: QuestHiddenType;
  startDate: string;
  endDate: string;
  mode: QuestMode;
}

interface SubQuestModalProps {
  onClose: () => void;
}

const CreateSubQuestModal = ({ onClose }: SubQuestModalProps) => {
  const [title, setTitle] = useState('');
  const [hidden, setHidden] = useState<QuestHiddenType>('FALSE');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateSubQuestProps>();

  const { createSubQuest } = useSubQuest();

  const onSubmit = (data: CreateSubQuestProps) => {
    createSubQuest(data).then(() => {
      onClose();
    });
  };

  useEffect(() => {
    setValue('hidden', hidden);
    setValue('title', title);
  }, [hidden, setValue, title]);

  return (
    <SubQuestModalStyle>
      <CloseButton onClick={onClose}></CloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" value={formattedCalendar(new Date())} {...register('startDate')} />
        <input type="hidden" value={formattedCalendar(new Date())} {...register('endDate')} />
        <input type="hidden" value={'SUB'} {...register('mode')} />
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
          {errors.title && errors.title.type === 'required' && (
            <p className="error-text">서브퀘스트는 필수입니다</p>
          )}
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
          <Button type="submit" size="medium" color="green" children={'추가하기'} />
          <Button onClick={onClose} size="medium" color="grayNormalActive" children={'닫기'} />
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

  .error-text {
    color: ${({ theme }) => theme.color.red};
    font-size: ${({ theme }) => theme.font.xsmall};
  }

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

export default CreateSubQuestModal;
