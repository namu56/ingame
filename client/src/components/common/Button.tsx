import { Buttonsize, styled } from 'styled-components';

interface BottonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size: Buttonsize;
  disabled?: boolean;
  color: string;
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
  background-color: ${({ theme, color }) => theme.color[color as keyof typeof theme.color]};
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  cursor: ${({ disabled }) => (disabled ? 'none' : 'pointer')};

  &:hover {
    background-color: ${({ theme, color }) =>
      theme.colorActive[color as keyof typeof theme.colorActive]};
  }
`;

export default Button;
