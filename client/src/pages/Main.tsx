import Dropdown from '@/components/common/Dropdown';
import styled from 'styled-components';
import UserProfile from '@/components/UserProfile/UserProfile';
import SubBox from '@/components/quests/SubBox';
import WeekCalendar from '@/components/common/WeekCalendar';
import { useSubQuest } from '@/hooks/useSubQuest';
import Loading from '@/components/common/Loading';
import MainBox from '@/components/quests/MainBox';
import { BiNotepad } from 'react-icons/bi';
import { useMainQuest } from '@/hooks/useMainQuest';
import CreateQuestButton from '@/components/CreateQuestButton';
import { useEffect, useState } from 'react';
import { UserInfo } from '@/models/userInfo.model';
import { useQuery } from '@tanstack/react-query';
import { USER } from '@/constant/queryKey';
import { getUserInfo } from '@/api/users.api';
import Title from '@/components/common/Title';

const Main = () => {
  const { quest, isSubLoading } = useSubQuest();
  const { mainQuests, isMainQuestsLoading, date } = useMainQuest();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const { data: userInfoData, refetch } = useQuery<UserInfo>({
    queryKey: [...USER.GET_USERINFO],
    queryFn: () => getUserInfo(),
  });

  useEffect(() => {
    if (userInfoData) {
      setUserInfo(userInfoData);
    }
  }, [userInfoData]);

  return (
    <MainStyle>
      <Dropdown />
      <WeekCalendar />
      <UserProfile userInfo={userInfo} />
      <section className="questSection">
        <div className="questTitle">
          <BiNotepad />
          <Title text="Main Quest" size="small" color="black" />
          <CreateQuestButton pageUrl="/createquest" />
        </div>
        <div>
          {mainQuests?.length ? (
            mainQuests?.map((content) => (
              <MainBox
                key={content.id}
                content={content}
                date={date}
                refetchMainBoxData={refetch}
              />
            ))
          ) : isMainQuestsLoading ? (
            <Loading />
          ) : (
            <p>등록된 메인 퀘스트가 없습니다</p>
          )}
        </div>
      </section>
      <section className="questSection">
        <div className="questTitle">
          <BiNotepad />
          <Title text="Sub Quest" size="small" color="black" />
          <CreateQuestButton modalName="subQuest" />
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
