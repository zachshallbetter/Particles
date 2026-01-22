export interface ColorShade {
  light: string;
  base: string;
  dark: string;
  bg: string | { light: string; dark: string };
  hover: string;
}

export interface WaveColorVariant {
  light: string;
  dark: string;
  base: string;
  bg: string;
  hover: string;
}

export interface WaveColors {
  primary: ColorShade;
  secondary: ColorShade;
  tertiary: ColorShade;
  quaternary: ColorShade;
}

export interface TextColorContext {
  default: string;
  container: string;
}

export interface TextThemeVariant {
  light: string;
  dark: string;
}

export interface TextColors {
  primary: TextColorContext;
  secondary: TextColorContext;
  tertiary: TextColorContext;
  quaternary: TextColorContext;
  heading: TextThemeVariant;
  body: TextThemeVariant;
}

export interface HoverColors {
  background: string;
  text: TextColorContext;
}

export interface ThemeModeColors {
  background: string;
  panel: string;
  border: string;
  text: TextColors;
  hover: HoverColors;
}

export interface BackgroundColors {
  light: string;
  dark: string;
  container: {
    light: string;
    dark: string;
  };
}

export interface ThemeColors {
  light: ThemeModeColors;
  dark: ThemeModeColors;
  primary: ColorShade;
  secondary: ColorShade;
  tertiary: ColorShade;
  quaternary: ColorShade;
  background: BackgroundColors;
  text: TextColors;
  wave: WaveColors;
}

export interface CategoryColor {
  light: string;
  base: string;
  dark: string;
  bg: {
    light: string;
    dark: string;
  };
}

export interface CategoryColors {
  frontend: CategoryColor;
  backend: CategoryColor;
  database: CategoryColor;
  cloud: CategoryColor;
  testing: CategoryColor;
  ai: CategoryColor;
  product: CategoryColor;
  protocol: CategoryColor;
}

export interface OpacityLevels {
  hover: string;
  selected: string;
  border: string;
  overlay: string;
  transparent: string;
  solid: string;
}
