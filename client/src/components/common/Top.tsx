import styled from 'styled-components';
import { IoIosArrowDropup } from 'react-icons/io';
import { media } from '@/styles/theme';

const Top = () => {
  // 버튼 클릭 시 맨 위로 이동
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <TopStyle>
      <TopButton onClick={scrollToTop}>{<IoIosArrowDropup size={40} />}</TopButton>
    </TopStyle>
  );
};

const TopStyle = styled.div`
  justify-content: flex-end;
  position: -webkit-sticky;
  position: sticky;
  bottom: 0;
  z-index: 999;

  ${media.desktop} {
    display: none;
  }

  ${media.mobile} {
    display: flex;
  }
`;

const TopButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.color.grayDark};
  &:hover {
    color: ${({ theme }) => theme.color.grayDark};
  }
`;

export default Top;
