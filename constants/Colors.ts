/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */


const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: '#6DCB6D',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    error: '#e74c3c',
    warning: '#f1c40f',
    success: '#2ecc71',
    card:'#6DCB6D'
  },
  dark: {
    text: '#F1F5F9',
    background: '#1E1E1E',
    tint: '#add8e6',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    error: "#922b21",
    warning: "#b9770e",
    success: "#145a32",
    card:'#add8e6'

  },
};
