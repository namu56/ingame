import styled from 'styled-components';
import { media } from '../styles/theme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <LayoutStyle>{children}</LayoutStyle>;
};

export const LayoutStyle = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 1.5rem;
  justify-content: flex-start;
  align-items: center;
  width: 400px;
  height: 100vh;
  border: 1px solid ${({ theme }) => theme.color.grayNormal};
  border-radius: ${({ theme }) => theme.borderRadius.large};

  ${media.mobile} {
    height: 100vh;
    width: 100vw;
    border-radius: 0;
    border: none;
  }
  overflow-y: scroll;
  background: ${({ theme }) => theme.color.white};
`;

export default Layout;
