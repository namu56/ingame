import styled from 'styled-components';
import React from 'react';
// import SubBox from '@/components/SubBox';
import MainBox from '@/components/MainBox';
import RankingBox from '@/components/RankingBox';
import SubBox from '@/components/SubBox';

const MainPage = () => {
  return (
    <MainPageStyle>
      <MainBox /> 
      {/* <RankingBox /> */}
      {/* <SubBox /> */}
    </MainPageStyle>
  );
};

const MainPageStyle = styled.div``;

export default MainPage;
