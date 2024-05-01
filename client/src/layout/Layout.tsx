import styled from 'styled-components';
import { media } from '../styles/theme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <LayoutStyle>
      <InnerStyle>{children}</InnerStyle>
    </LayoutStyle>
  );
};

const LayoutStyle = styled.div`
  background: ${({ theme }) => theme.color.grayNormal};
  padding: 2rem 0;
  height: 100%;

  ${media.mobile} {
    padding: 0;
  }
`;

const InnerStyle = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 2rem;
  justify-content: flex-start;
  align-items: center;
  max-width: 480px;
  border: 1px solid ${({ theme }) => theme.color.grayNormalActive};
  border-radius: ${({ theme }) => theme.borderRadius.large};

  ${media.mobile} {
    min-height: 800px;
  }

  overflow-y: scroll;
  background: ${({ theme }) => theme.color.white};
`;

export default Layout;
