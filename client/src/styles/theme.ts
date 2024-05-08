import { DefaultTheme } from 'styled-components';

const color = {
  black: '#000000',
  white: '#FFFFFF',
  coral: '#FF7262',
  coralOpacity70: 'rgba(255, 114, 98, 0.7)',
  red: '#F24E1E',
  purple: '#A259FF',
  blue: '#1ABCFE',
  green: '#0ACF83',
  lightGreen: '#D1eae7',
  greenOpactiy30: 'rgba(10, 207, 131, 0.3)',
  grayLight: '#FDFDFD',
  grayLightActive: '#F9F9F9',
  grayNormal: '#EBEBEB',
  grayNormalActive: '#BCBCBC',
  grayDark: '#b0b0b0',
  grayDarkActive: '#8d8d8d',
};

const font = {
  xsmall: '0.75rem',
  small: '1rem',
  medium: '1.25rem',
  large: '1.5rem',
  xlarge: '2rem',
};

const buttonSize = {
  large: {
    fontSize: '1.5rem',
    padding: '1rem 2rem',
  },
  medium: {
    fontSize: '1rem',
    padding: '0.5rem 1rem',
  },
  small: {
    fontSize: '0.75rem',
    padding: '0.25rem 0.5rem',
  },
};

const inputSize = {
  small: {
    width: '14rem',
    height: '36px',
  },
  medium: {
    width: '17.6rem',
    height: '36px',
  },
  lagre: {
    width: '20rem',
    height: '36px',
  },
};

const borderRadius = {
  small: '5px',
  medium: '10px',
  large: '20px',
  xlarge: '999px',
};

const mediaQuery = (maxWidth: number): string => `@media (max-width: ${maxWidth}px)`;

export const media = {
  custom: mediaQuery,
  mobile: mediaQuery(480),
  tablet: mediaQuery(1024),
  desktop: mediaQuery(1440),
};

export const theme: DefaultTheme = {
  color,
  font,
  media,
  borderRadius,
  buttonSize,
  inputSize,
};

export type Theme = typeof theme;
