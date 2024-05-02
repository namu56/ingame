import styled from 'styled-components';
import { rank } from '@/shared/dummy';
import { profileURL } from '@/shared/dummy';

const RankingBox = () => {
  return (
    <>
      {rank.ranking.map((rank, index) => (
        <RankingBoxStyle key={index}>
        <section className='rpContainer'>
          <div className='rank'>{index + 1}</div>
          <div className='rProfile'><img src={profileURL} alt="" /></div>
        </section>
        <section className='nlContainer'>
          <h2 className='nickname'>{rank.nickname}</h2>
          <div className='lpContainer'>
            <p className='level'>LV {Math.floor(rank.point / 1024)}</p>
            <p className='point'>P {rank.point}</p>
          </div>
        </section>
      </RankingBoxStyle>
      ))}
    </>
  );
};

const RankingBoxStyle = styled.div`
  width: 22rem;
  height: 61px;

  background: ${({ theme }) => theme.color.white};
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
  border-radius: ${({ theme }) => theme.borderRadius.small};

  display: flex;
  align-items: center;
  padding: 10px;
  font-size: ${({ theme }) => theme.font.xsmall};
  margin-bottom: 5px;

  .rpContainer {
    width: 80px;
    display: flex;
    align-items: center;
    gap: 25px;
  }

  .rank {
    font-size: ${({ theme }) => theme.font.medium};
    font-weight: bold;
    padding-left: 10px;
  }

  .rProfile {
    width: 30px;
    height: 30px;
  }

  .rProfile img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .nlContainer {
    width: 233px;
    display: flex;
    flex-direction: column;
  }
  
  .nickname {
    margin-bottom: 5px;
  }

  .lpContainer {
    display: flex;
    justify-content: space-between;
  }

`;

export default RankingBox;