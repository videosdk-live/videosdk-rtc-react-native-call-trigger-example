import React from "react";
import {
  View,
  Text,
  Clipboard,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useMeeting } from "@videosdk.live/react-native-sdk";
import {
  CallEnd,
  CameraSwitch,
  Copy,
  MicOff,
  MicOn,
  VideoOff,
  VideoOn,
} from "../../../assets/icons";
import colors from "../../../styles/colors";
import IconContainer from "../../../components/IconContainer";
import LocalViewContainer from "./LocalViewContainer";
import LargeView from "./LargeView";
import MiniView from "./MiniView";
import { ROBOTO_FONTS } from "../../../styles/fonts";
import Toast from "react-native-simple-toast";

export default function OneToOneMeetingViewer() {
  const {
    participants,
    localWebcamOn,
    localMicOn,
    leave,
    changeWebcam,
    toggleWebcam,
    toggleMic,
    meetingId,
  } = useMeeting({
    onError: (data) => {
      const { code, message } = data;
      Toast.show(`Error: ${code}: ${message}`);
    },
  });

  const participantIds = [...participants.keys()];

  const participantCount = participantIds ? participantIds.length : null;

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: ROBOTO_FONTS.RobotoBold,
                color: colors.primary[100],
              }}
            >
              {meetingId ? meetingId : "xxx - xxx - xxx"}
            </Text>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                marginLeft: 10,
              }}
              onPress={() => {
                Clipboard.setString(meetingId);
                Toast.show("Meeting Id copied Successfully");
              }}
            >
              <Copy fill={colors.primary[100]} width={18} height={18} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              changeWebcam();
            }}
          >
            <CameraSwitch height={26} width={26} fill={colors.primary[100]} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Center */}
      <View style={{ flex: 1, marginTop: 8, marginBottom: 12 }}>
        {participantCount > 1 ? (
          <>
            <LargeView participantId={participantIds[1]} />
            <MiniView participantId={participantIds[0]} />
          </>
        ) : participantCount === 1 ? (
          <LocalViewContainer participantId={participantIds[0]} />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size={"large"} />
          </View>
        )}
      </View>
      {/* Bottom */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <IconContainer
          backgroundColor={"red"}
          onPress={() => {
            leave();
          }}
          Icon={() => {
            return <CallEnd height={26} width={26} fill="#FFF" />;
          }}
        />
        <IconContainer
          style={{
            borderWidth: 1.5,
            borderColor: "#2B3034",
          }}
          backgroundColor={!localMicOn ? colors.primary[100] : "transparent"}
          onPress={() => {
            toggleMic();
          }}
          Icon={() => {
            return localMicOn ? (
              <MicOn height={24} width={24} fill="#FFF" />
            ) : (
              <MicOff height={28} width={28} fill="#1D2939" />
            );
          }}
        />
        <IconContainer
          style={{
            borderWidth: 1.5,
            borderColor: "#2B3034",
          }}
          backgroundColor={!localWebcamOn ? colors.primary[100] : "transparent"}
          onPress={() => {
            toggleWebcam();
          }}
          Icon={() => {
            return localWebcamOn ? (
              <VideoOn height={24} width={24} fill="#FFF" />
            ) : (
              <VideoOff height={36} width={36} fill="#1D2939" />
            );
          }}
        />
      </View>
    </>
  );
}
