import styled from 'styled-components';

const rank = {
  "status": 200,
  "message": "success",
  "updated": 20200520-240000, // 업데이트 시각 [format: YYYYMMDD-HHMMSS]
  "count": 3,  // ranking 요소 개수
  "ranking": [  //최대 100개 출력 
    {
      "userId": 1,
      "nickname": "하늘 다람쥐",
      "point": 220000
    },
    {
      "userId": 2,
      "nickname": "무당 벌레",
      "point": 190000
    },
    {
      "userId": 3,
      "nickname": "물푸레나무",
      "point": 180000
    }
  ]
}

const RankingBox = () => {

  const profileURL = "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg";

  return (
    <>
      {rank.ranking.map((rank, index) => (
        <RankingBoxStyle key={index}>
        <div className='rpContainer'>
          <div className='rank'>{index + 1}</div>
          <div className='rProfile'><img src={profileURL} alt="" /></div>
        </div>
        <div className='nlContainer'>
          <div className='nickname'>{rank.nickname}</div>
          <div className='lpContainer'>
            <div className='level'>LV {Math.floor(rank.point / 1024)}</div>
            <div className='point'>P {rank.point}</div>
          </div>
        </div>
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