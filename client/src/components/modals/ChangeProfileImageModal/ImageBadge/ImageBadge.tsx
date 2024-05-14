import styled from 'styled-components';

interface ImageBadgeProps {
  imgSrc: string;
  value: string | null;
  checked: boolean;
}

const ImageBadge = ({ imgSrc, value, checked }: ImageBadgeProps) => {
  return (
    <ImageBadgeStyle $checked={checked}>
      <img src={imgSrc} width={40} height={40} alt="default" />
    </ImageBadgeStyle>
  );
};

const ImageBadgeStyle = styled.div<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: ${({ theme }) => theme.borderRadius.xlarge};
  background-color: ${({ theme, $checked }) =>
    $checked ? theme.color.coralOpacity70 : theme.color.grayNormal};

  &:hover {
    cursor: pointer;
  }
`;

export default ImageBadge;
