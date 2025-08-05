import { Dimensions, Platform, StatusBar } from 'react-native';

const { height, width } = Dimensions.get('window');

export const DESIGN_RESOLUTION_IPHONE = 640;
export const DESIGN_RESOLUTION_ANDROID = 1080;

export const responsiveHeight = (h: number) => height * (h / 100);

export const deviceHeight = height;

export const deviceWidth = width;

export const isIOS = Platform.OS === 'ios';

export const StatusBarHeight = Platform.select({
  ios: isIphoneXorAbove() ? 44 : 20,
  android: StatusBar.currentHeight,
  default: 0,
});

export const responsiveWidth = (w: number) => width * (w / 100);

export const responsiveFontSize = (f: number) =>
  Math.sqrt(height * height + width * width) * (f / 100);

export function getBaseLineWidth() {
  if (Platform.OS === 'ios') {
    return 375;
  } else {
    return 320;
  }
}

export const verticalScale = (size: number) => (height / 812) * size;
export function getResponsiveFontSize(fontSize: any) {
  if (fontSize) {
    let size = fontSize;
    const [shortDimension] = width < height ? [width, height] : [height, width];
    const guidelineBaseWidth = getBaseLineWidth();
    const scaleSize = (s: number) => (shortDimension / guidelineBaseWidth) * s;
    size = size + (scaleSize(size) - size) * 0.3;
    return Math.round(size);
  }
  return 17;
}

export function isIphoneXorAbove() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    (dimen.height === 780 ||
      dimen.width === 780 ||
      dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 852 ||
      dimen.width === 852 ||
      dimen.height === 932 ||
      dimen.width === 932 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 926 ||
      dimen.width === 926 ||
      dimen.height === 874 ||
      dimen.width === 874 ||
      dimen.height === 956 ||
      dimen.width === 956)
  );
}

export function getHeightOfBottomBar() {
  return responsiveHeight(8) - (isIphoneXorAbove() ? 18 : 0);
}

//scale
export function scale(size: number) {
  const baseWidth = 350;
  const windowDimensions = Dimensions.get('window');
  const shorterWindowDimension =
    windowDimensions.width > windowDimensions.height
      ? windowDimensions.height
      : windowDimensions.width;
  return (shorterWindowDimension / baseWidth) * size;
}
