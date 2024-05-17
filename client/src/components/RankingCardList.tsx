import styled from 'styled-components';
import RankingCard from './RankingCard';
import { useRank } from '@/hooks/useRank';

const RankingCardList = () => {
  const { rankingData } = useRank();
  return (
    <>
      <RankingCardListStyle>
        {rankingData?.map((item, index) => <RankingCard key={item.id} {...item} />)}
      </RankingCardListStyle>
    </>
  );
};

const RankingCardListStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default RankingCardList;
