import { Dimensions } from "react-native";

const { height, width } = Dimensions.get('window');
export const responsiveWidth = (w: number) => width * (w / 100);
export const responsiveHeight = (h: number) => height * (h / 100);
export const responsiveFontSize = (f: number) =>
    Math.sqrt(height * height + width * width) * (f / 100);

export const scale = (size: number) => (width / 375) * size;

export const verticalScale = (size: number) => (height / 812) * size;