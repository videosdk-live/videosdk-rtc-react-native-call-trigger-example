import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SCREEN_NAMES } from "./src/navigators/screenNames";
import Meeting from "./src/scenes/meeting";
import { LogBox, Text, Alert } from "react-native";
import RNCallKeep from "react-native-callkeep";
import Home from "./src/scenes/home";
import OverlayPermissionModule from "videosdk-rn-android-overlay-permission";
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
    setTimeout(() => {
      if (Platform.OS === "android") {
        OverlayPermissionModule.isRequestOverlayPermissionGranted((status) => {
          if (status) {
            Alert.alert(
              "Please Enable the additional permissions",
              "You will not receive call while the app is in background if you disable these permissions",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () =>
                    OverlayPermissionModule.requestOverlayPermission(),
                },
              ],
              { cancelable: false }
            );
          }
        });
      }
    }, 3000);
  }, []);
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
        foregroundService: {
          channelId: "com.company.my",
          channelName: "Foreground service for my app",
          notificationTitle: "My app is running on background",
          notificationIcon: "Path to the resource icon of the notification",
        },
      },
    };

    RNCallKeep.setup(options);
    RNCallKeep.setAvailable(true);
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
