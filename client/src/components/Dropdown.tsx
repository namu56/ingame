import useOutsideClick from '@/hooks/useOutsideClick';
import { useState } from 'react';
import styled from 'styled-components';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { ROUTERS } from '@/constant/route';
import { useUser } from '@/hooks/useUser';
import { useMessage } from '@/hooks/useMessage';

interface DropdownProps {
  isOpen?: boolean;
}

const Dropdown = ({ isOpen = false }: DropdownProps) => {
  const [open, setOpen] = useState(isOpen);
  const dropdownRef = useOutsideClick<HTMLDivElement>(open, () => setOpen(false));

  const { userLogout } = useAuth();
  const { userDelete } = useUser();
  const { showConfirm } = useMessage();

  const handleLogout = () => {
    showConfirm('로그아웃 하시겠습니까?', userLogout);
  };
  return (
    <DropdownStyle $open={open} ref={dropdownRef}>
      <button className="toggle" onClick={() => setOpen(!open)}>
        <GiHamburgerMenu />
      </button>
      {open && (
        <div className="panel">
          <ul>
            <li>
              <Link className="link-styles" to={ROUTERS.MAIN}>
                메인 화면
              </Link>
            </li>
            <li>
              <Link className="link-styles" to={ROUTERS.RANK}>
                랭킹
              </Link>
            </li>
            <li>
              <button onClick={handleLogout}>로그아웃</button>
            </li>
            <li>
              <button onClick={userDelete}>회원 탈퇴</button>
            </li>
          </ul>
        </div>
      )}
    </DropdownStyle>
  );
};

interface DropdownStyleProps {
  $open: boolean;
}

const DropdownStyle = styled.div<DropdownStyleProps>`
  display: flex;
  justify-content: flex-end;
  position: relative;

  button {
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
  }

  .toggle {
    padding: 0;
  }

  .panel {
    position: absolute;
    top: 20px;
    right: 0;
    background: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
    border-radius: ${({ theme }) => theme.borderRadius.small};
    z-index: 100;
    border: 1px solid ${({ theme }) => theme.color.grayNormal};
    font-size: ${({ theme }) => theme.font.small};
    color: ${({ theme }) => theme.color.black};

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 10px;
        border-bottom: 1px solid ${({ theme }) => theme.color.grayNormal};
        text-align: center;
        &:hover {
          background-color: ${({ theme }) => theme.colorActive.grayLight};
          cursor: pointer;
        }

        &:last-child {
          border-bottom: none;
        }

        .link-styles {
          display: block;
          text-decoration: none;
          color: ${({ theme }) => theme.color.black};
        }
      }
    }
  }
`;

export default Dropdown;
