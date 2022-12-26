import React from "react";
import { Platform, SafeAreaView } from "react-native";
import colors from "../../styles/colors";
import {
  MeetingConsumer,
  MeetingProvider,
} from "@videosdk.live/react-native-sdk";
import MeetingContainer from "./MeetingContainer";
import { SCREEN_NAMES } from "../../navigators/screenNames";
import IncomingVideoCall from "../../utils/incoming-video-call";

export default function ({ navigation, route }) {
  const token = route.params.token;
  const meetingId = route.params.meetingId;
  const micEnabled = route.params.micEnabled ? route.params.micEnabled : true;
  const webcamEnabled = route.params.webcamEnabled
    ? route.params.webcamEnabled
    : true;
  const name = route.params.name;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.primary[900], padding: 12 }}
    >
      <MeetingProvider
        config={{
          meetingId: meetingId,
          micEnabled: false,
          webcamEnabled: webcamEnabled,
          name: name,
          notification: {
            title: "Video SDK Meeting",
            message: "Meeting is running.",
          },
        }}
        token={token}
      >
        <MeetingConsumer
          {...{
            onMeetingLeft: () => {
              Platform.OS == "ios" && IncomingVideoCall.endAllCall();
              navigation.navigate(SCREEN_NAMES.Home);
            },
          }}
        >
          {() => {
            return <MeetingContainer webcamEnabled={webcamEnabled} />;
          }}
        </MeetingConsumer>
      </MeetingProvider>
    </SafeAreaView>
  );
}
