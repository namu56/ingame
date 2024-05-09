import styled from 'styled-components';

interface SideBoxProps {
  isAccordion: boolean;
  checked: boolean;
  handleCheckboxClick: () => void;
  content: string;
}

const SideBox: React.FC<SideBoxProps> = ({ isAccordion, checked, handleCheckboxClick, content }) => {
  return (
    <SideBoxStyle className={`sideBox ${isAccordion ? 'show' : ''}`}>
      <label className='cBox'>
        <input type='checkbox' checked={checked} onChange={handleCheckboxClick} />
      </label>
      <h2 className='sTitle'>{content}</h2>
    </SideBoxStyle>
  );
};

const SideBoxStyle = styled.div`
  position: relative;
  left: 23px;

  display: flex;
  align-items: center;
  padding: 0px 10px;
  width: 90%;
  height: 55px;
  background: ${({ theme }) => theme.color.white};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  gap: 20px;

  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  transform: translateY(-100%);
  max-height: 0;
  overflow: hidden;
  opacity: 0;

  &.show {
    transform: translateY(0%);
    max-height: 100%;
    opacity: 1;
  }

  .cBox {
    cursor: pointer;
  }
`;

export default SideBox;