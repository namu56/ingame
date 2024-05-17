import Dropdown from '@/components/Dropdown';
import styled from 'styled-components';
import UserProfile from '@/components/UserProfile/UserProfile';
import SubBox from '@/components/SubBox';
import WeekCalendar from '@/components/WeekCalendar';
import { useQuest } from '@/hooks/useSubQuest';
import Loading from '@/components/Loading';
import CreateSubQuestButton from '@/components/CreateSubQuestButton';
import { BiNotepad } from 'react-icons/bi';
import CreateMainQuestButton from '@/components/CreateMainQuestButton';
import { useMainQuest } from '@/hooks/useMainQuest';
import MainBox from '@/components/MainBox';

const Main = () => {
  const { quest, isLoading } = useQuest();
  const { mainQuest } = useMainQuest();

  return (
    <MainStyle>
      <Dropdown />
      <WeekCalendar />
      <UserProfile />
      <MainQuestStyle>
        <div className="mainquestTitle">
          <BiNotepad />
          <h2>Main Quest</h2>
          <CreateMainQuestButton />
        </div>
        <div className="mainquestList">
          {mainQuest ? (
            mainQuest.map((content) => <MainBox key={content.id} content={content} />)
          ) : isLoading ? (
            <Loading />
          ) : (
            <p>등록된 메인 퀘스트가 없습니다</p>
          )}
        </div>
      </MainQuestStyle>
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

const MainQuestStyle = styled.div`
  .mainquestTitle {
    display: flex;
    align-items: center;
    gap: 0.1rem;
  }
`;

export default Main;
