import styled from 'styled-components';
import RankingCard from './RankingCard';
import { useQuery } from '@tanstack/react-query';
import { getRanking } from '@/api/ranking.api';

const RankingCardList = () => {
  const { data, isLoading, error } = useQuery({queryKey: ['ranking'], queryFn: () => getRanking()});
  return (
    <>
      <RankingCardListStyle>
        {data?.map((item, index) => (
          <RankingCard key={item.id} {...item} />
        ))}
      </RankingCardListStyle>
    </>
  );
};

const RankingCardListStyle = styled.div`

`;

export default RankingCardList;