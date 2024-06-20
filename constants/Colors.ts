/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#022a37";
const tintColorDark = "#fff";
const primary = "#f6c435";
const lightPrimary = "#f5e050";
const lighterPrimary = "#fdf8e1";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fefefe",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    primary: primary,
    lightPrimary: lightPrimary,
    lighterPrimary: lighterPrimary,
    backgroundGray: "#f5f5f5",
    backgroundGrayText: "#7b7b7b",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    lighterPrimary: lighterPrimary,
    primary: primary,
    lightPrimary: lightPrimary,
    gray: "#101820ff",
    backgroundGray: "#101820ff",
    backgroundGrayText: "#7b7b7b",
    backgroundDark: "#111111",
  },
};
