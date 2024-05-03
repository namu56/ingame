import type { Theme } from './theme';

declare module 'styled-components' {
  export type Buttonsize = 'large' | 'medium' | 'small';

  export interface DefaultTheme extends Theme {
    color: {
      black: string;
      white: string;
      coral: string;
      coralOpacity70: string;
      red: string;
      purple: string;
      blue: string;
      green: string;
      greenOpactiy30: string;
      grayLight: string;
      grayLightActive: string;
      grayNormal: string;
      grayNormalActive: string;
      grayDark: string;
      grayDarkActive: string;
    };

    font: {
      xsmall: string;
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };

    buttonSize: {
      [key in Buttonsize]: {
        fontSize: string;
        padding: string;
      };
    };

    borderRadius: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
  }

  export const theme: DefaultTheme = {
    color,
    font,
    media,
    borderRadius,
    buttonSize,
  };
}