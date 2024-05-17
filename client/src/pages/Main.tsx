import Dropdown from '@/components/Dropdown';
import styled from 'styled-components';
import UserProfile from '@/components/UserProfile/UserProfile';
import SubBox from '@/components/SubBox';
import WeekCalendar from '@/components/WeekCalendar';
import { useQuest } from '@/hooks/useSubQuest';
import Loading from '@/components/Loading';
import CreateSubQuestButton from '@/components/CreateSubQuestButton';
import { BiNotepad } from 'react-icons/bi';

const Main = () => {
  const { quest, isLoading } = useQuest();

  return (
    <MainStyle>
      <Dropdown />
      <WeekCalendar />
      <UserProfile />
      <section className="subQuestSection">
        <div className="questTitle">
          <BiNotepad />
          <h2>Sub Quest</h2>
          <CreateSubQuestButton />
        </div>
        <div className="subquestList">
          {quest ? (
            quest.map((content) => <SubBox key={content.id} content={content} />)
          ) : isLoading ? (
            <Loading />
          ) : (
            <p>등록된 서브 퀘스트가 없습니다</p>
          )}
        </div>
      </section>
    </MainStyle>
  );
};

const MainStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;

  .subQuestSection {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .questTitle {
      display: flex;
      align-items: center;
    }
  }
`;

export default Main;
