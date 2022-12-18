import { RFValue } from "react-native-responsive-fontsize";

export const STANDERD_DESIGN_HEIGHT_WIDTH = { HEIGHT: 640, WIDTH: 360 };

export const convertRFValue = (fontSize) =>
  RFValue(fontSize, STANDERD_DESIGN_HEIGHT_WIDTH.HEIGHT);
