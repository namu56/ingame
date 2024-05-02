import useOutsideClick from '@/hooks/useOutsideClick';
import { useState } from 'react';
import styled from 'styled-components';

interface DropdownProps {
  children: React.ReactNode;
  toggleButton: React.ReactNode;
  isOpen?: boolean;
}

const Dropdown = ({ children, toggleButton, isOpen = false }: DropdownProps) => {
  const [open, setOpen] = useState(isOpen);
  const dropdownRef = useOutsideClick<HTMLDivElement>(open, () => setOpen(false));

  return (
    <DropdownStyle $open={open} ref={dropdownRef}>
      <button className="toggle" onClick={() => setOpen(!open)}>
        {toggleButton}
      </button>
      {open && <div className="panel">{children}</div>}
    </DropdownStyle>
  );
};

interface DropdownStyleProps {
  $open: boolean;
}

const DropdownStyle = styled.div<DropdownStyleProps>`
  position: relative;

  button {
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
  }

  .panel {
    position: absolute;
    top: 40px;
    right: 0;
    background: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
    border-radius: ${({ theme }) => theme.borderRadius.small};
    z-index: 100;
    border: 1px solid ${({ theme }) => theme.color.grayNormalActive};
    font-size: ${({ theme }) => theme.font.small};
    color: ${({ theme }) => theme.color.black};

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 12px;
        border-bottom: 1px solid ${({ theme }) => theme.color.grayNormalActive};
        &:hover {
          background-color: ${({ theme }) => theme.color.grayLightActive};
          cursor: pointer;
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
`;

export default Dropdown;
