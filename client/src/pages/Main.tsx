import Dropdown from '@/components/Dropdown';
import styled from 'styled-components';
import UserProfile from '@/components/UserProfile';
import SubBox from '@/components/SubBox';
import WeekCalendar from '@/components/WeekCalendar';
import { useQuest } from '@/hooks/useQuest';
import Loading from '@/components/Loading';
import { GrAddCircle } from 'react-icons/gr';

const Main = () => {
  const { quest } = useQuest();

  const addSubQuest = () => {
    console.log('addSubQuest');
  };

  return (
    <MainStyle>
      <Dropdown />
      <WeekCalendar />
      <UserProfile />
      <section className="subQuestSection">
        <div className="questTitle">
          <h2>Sub Quest</h2>
          <button className="subquestAdd" onClick={addSubQuest}>
            <GrAddCircle />
          </button>
        </div>
        <div className="subquestList">
          {quest ? (
            quest.map((content) => <SubBox key={content.id} content={content} />)
          ) : (
            <Loading />
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
      gap: 0.5rem;

      .subquestAdd {
        background: none;
        display: flex;
        align-items: center;
      }
    }
  }
`;

export default Main;
