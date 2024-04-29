import type { Theme } from './theme';

declare module 'styled-components' {
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
    };

    font: {
      xsmall: string;
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };

    buttonSize: {
      large: {
        fontSize: string;
        padding: string;
      };
      medium: {
        fontSize: string;
        padding: string;
      };
      small: {
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
