/**
 * @format
 */

import { AppRegistry, StatusBar, Linking } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { register } from "@videosdk.live/react-native-sdk";
import colors from "./src/styles/colors";
import messaging from "@react-native-firebase/messaging";
import React from "react";
import Incomingvideocall from "./src/utils/incoming-video-call";
import { updateCallStatus } from "./src/api/api";

StatusBar.setBackgroundColor(colors.primary[900]);

// Register the VideoSDK service
register();

const firebaseListener = async (remoteMessage) => {
  const { token, meetingId, callerName, callerFCM, type } = remoteMessage.data;
  console.log("# index js TYPE --- ", type);

  if (type === "CALL_INITIATED") {
    const incomingCallAnswer = ({ callUUID }) => {
      Incomingvideocall.backToForeground();
      updateCallStatus({
        fcmToken: callerFCM,
        type: "ACCEPTED",
      });
      Incomingvideocall.endIncomingcallAnswer(callUUID);
      Linking.openURL(
        `videocalling://meetingscreen/${token}/${meetingId}`
      ).catch((err) => {
        Toast.show(`Error`, err);
      });
    };

    const endIncomingCall = () => {
      Incomingvideocall.endIncomingcallAnswer();
      updateCallStatus({ fcmToken: callerFCM, type: "REJECTED" });
    };

    Incomingvideocall.configure(incomingCallAnswer, endIncomingCall);
    Incomingvideocall.displayIncomingCall(callerName);
    Incomingvideocall.backToForeground();
  }
};

// Register background handler
messaging().setBackgroundMessageHandler(firebaseListener);

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
