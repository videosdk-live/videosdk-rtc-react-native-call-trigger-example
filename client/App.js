import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SCREEN_NAMES } from "./src/navigators/screenNames";
import Meeting from "./src/scenes/meeting";
import { LogBox, Text, Alert } from "react-native";
import Home from "./src/scenes/home";
import OverlayPermissionModule from "videosdk-rn-android-overlay-permission";
import RNCallKeep from "react-native-callkeep";
LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

const { Navigator, Screen } = createStackNavigator();

const linking = {
  prefixes: ["videocalling://"],
  config: {
    screens: {
      meetingscreen: {
        path: `meetingscreen/:token/:meetingId`,
      },
    },
  },
};

export default function App() {
  useEffect(() => {
    const options = {
      ios: {
        appName: "VideoSDK",
      },
      android: {
        alertTitle: "Permissions required",
        alertDescription:
          "This application needs to access your phone accounts",
        cancelButton: "Cancel",
        okButton: "ok",
        imageName: "phone_account_icon",
      },
    };
    RNCallKeep.setup(options);
    RNCallKeep.setAvailable(true);

    if (Platform.OS === "android") {
      OverlayPermissionModule.requestOverlayPermission();
    }
  }, []);

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Navigator
        screenOptions={{
          animationEnabled: false,
          presentation: "modal",
        }}
        initialRouteName={SCREEN_NAMES.Home}
      >
        <Screen
          name={SCREEN_NAMES.Meeting}
          component={Meeting}
          options={{ headerShown: false }}
        />
        <Screen
          name={SCREEN_NAMES.Home}
          component={Home}
          options={{ headerShown: false }}
        />
      </Navigator>
    </NavigationContainer>
  );
}
