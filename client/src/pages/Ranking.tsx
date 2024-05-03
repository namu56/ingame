import styled from 'styled-components';
import { GiHamburgerMenu } from "react-icons/gi";
import Top from '@/components/Top';
import tropy from '@/assets/images/tropy.png';
import { media } from '@/styles/theme';
import RankingCardList from '@/components/RankingCardList';

const Ranking = () => {
  return (
    <RankingStyle>
      <header className='hamberger'><GiHamburgerMenu /></header>
      <div className='rankTitleContainer'>
        <img src={tropy} alt="tropy" />
        <p>랭킹 순위</p>
      </div>
      <div>
        <RankingCardList />
      </div>
      <div className='topBtn'><Top /></div>
    </RankingStyle>
  );
};

const RankingStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: ${({ theme }) => theme.color.white};

  .hamberger {
    display: flex;
    justify-content: flex-end;
    font-size: ${({ theme }) => theme.font.large};
  }

  .rankTitleContainer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 15px;
    padding-bottom: 10px;
    font-size: ${({ theme }) => theme.font.medium};
  }


  .topBtn {
    display: none;

    ${media.mobile} {
      display: flex;
      position: fixed;
      bottom: 10px;
      right: 43%;
    }
  }
`;

export default Ranking;
