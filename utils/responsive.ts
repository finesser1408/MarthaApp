import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Small phones like 360x640 or short heights
export const isSmallScreen = height < 700 || width < 360;

// Simple scale based on iPhone 11 width reference (375)
export const scale = (size: number) => Math.round((width / 375) * size);

// Moderates the scale to avoid too-small/too-large sizes
export const moderateScale = (size: number, factor = 0.5) => {
  const scaled = scale(size);
  return Math.round(size + (scaled - size) * factor);
};

export const screen = { width, height };

export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';
