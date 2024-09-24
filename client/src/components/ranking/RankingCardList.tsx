import styled from 'styled-components';
import RankingCard from './RankingCard';
import { useRank } from '@/hooks/useRank';
import { useEffect, useRef } from 'react';

const RankingCardList = () => {
  const { rankingData, fetchNextPage, hasNextPage } = useRank();
  const loader = useRef<HTMLDivElement>(null);

  const handleObserver = (entities: IntersectionObserverEntry[]) => {
    const target = entities[0];
    if (target.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [fetchNextPage, hasNextPage]);

  return (
    <>
      <RankingCardListStyle>
        {rankingData &&
          rankingData
            .flatMap((response) => response.rankings)
            .map((rankingItem) => (
              <RankingCard
                id={rankingItem.id}
                nickname={rankingItem.nickname}
                point={rankingItem.point}
                rank={rankingItem.rank}
                level={rankingItem.level}
                key={rankingItem.id}
              />
            ))}
        <div ref={loader} />
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
