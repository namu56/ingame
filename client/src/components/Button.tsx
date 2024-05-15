import { theme } from '@/styles/theme';
import { Buttonsize, styled } from 'styled-components';

interface BottonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size: Buttonsize;
  disabled?: boolean;
  color: keyof typeof theme.color;
}

const Button: React.FC<BottonProps> = ({
  className,
  children,
  size,
  color,
  disabled,
  onClick,
  type,
}) => {
  return (
    <ButtonStyle
      className={className}
      size={size}
      color={color}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </ButtonStyle>
  );
};

const ButtonStyle = styled.button<Omit<BottonProps, 'children'>>`
  color: ${({ theme }) => theme.color.white};
  padding: ${({ theme, size }) => theme.buttonSize[size].padding};
  font-size: ${({ theme, size }) => theme.buttonSize[size].fontSize};
  background-color: ${(props) => props.theme.color[props.color]};
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  cursor: ${({ disabled }) => (disabled ? 'none' : 'pointer')};
`;

export default Button;
