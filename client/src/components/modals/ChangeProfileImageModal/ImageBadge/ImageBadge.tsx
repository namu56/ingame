import styled from 'styled-components';
import { SetStateAction } from 'react';
interface ImageBadgeProps {
  imgSrc: string;
  value: string | null;
  checked: boolean;
  handleSelectedImage: React.Dispatch<SetStateAction<string | null>>;
}

const ImageBadge = ({ imgSrc, value, checked, handleSelectedImage }: ImageBadgeProps) => {
  return (
    <ImageBadgeStyle $checked={checked} onClick={() => handleSelectedImage(value)}>
      <img src={imgSrc} width={35} height={35} alt="default" />
    </ImageBadgeStyle>
  );
};

const ImageBadgeStyle = styled.div<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid
    ${({ theme, $checked }) => ($checked ? theme.color.coralOpacity70 : theme.color.grayNormal)};
  border-radius: ${({ theme }) => theme.borderRadius.xlarge};
  background-color: ${({ theme, $checked }) =>
    $checked ? theme.color.coralOpacity70 : theme.color.grayNormal};

  &:hover {
    cursor: pointer;
    border-color: ${({ theme }) => theme.color.white};
  }
`;

export default ImageBadge;
