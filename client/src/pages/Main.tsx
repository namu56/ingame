import Dropdown from '@/components/common/Dropdown';
import styled from 'styled-components';
import UserProfile from '@/components/UserProfile/UserProfile';
import SubBox from '@/components/quests/SubBox';
import WeekCalendar from '@/components/common/WeekCalendar';
import { useSubQuest } from '@/hooks/useSubQuest';
import Loading from '@/components/common/Loading';
import CreateSubQuestButton from '@/components/quests/CreateSubQuestButton';
import { BiNotepad } from 'react-icons/bi';
import CreateMainQuestButton from '@/components/quests/CreateMainQuestButton';
import { useMainQuest } from '@/hooks/useMainQuest';
import MainBox from '@/components/quests/MainBox';

const Main = () => {
  const { quest, isSubLoading } = useSubQuest();
  const { mainQuest, isMainLoading, date } = useMainQuest();

  return (
    <MainStyle>
      <Dropdown />
      <WeekCalendar />
      <UserProfile />
      <section className="questSection">
        <div className="questTitle">
          <BiNotepad />
          <h2>Main Quest</h2>
          <CreateMainQuestButton />
        </div>
        <div>
          {mainQuest?.length ? (
            mainQuest?.map((content) => <MainBox key={content.id} content={content} date={date} />)
          ) : isMainLoading ? (
            <Loading />
          ) : (
            <p>등록된 메인 퀘스트가 없습니다</p>
          )}
        </div>
      </section>
      <section className="questSection">
        <div className="questTitle">
          <BiNotepad />
          <h2>Sub Quest</h2>
          <CreateSubQuestButton />
        </div>
        <div>
          {quest?.length ? (
            quest.map((content) => <SubBox key={content.id} content={content} />)
          ) : isSubLoading ? (
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

  .questSection {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .questTitle {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  }
`;

export default Main;
