import React, { useEffect, useState, useRef } from "react";
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  Clipboard,
  Alert,
  Linking,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CallEnd, Copy } from "../../assets/icons";
import TextInputContainer from "../../components/TextInputContainer";
import colors from "../../styles/colors";
import { ROBOTO_FONTS } from "../../styles/fonts";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import Toast from "react-native-simple-toast";
import {
  updateCallStatus,
  initiateCall,
  getToken,
  createMeeting,
} from "../../api/api";
import { SCREEN_NAMES } from "../../navigators/screenNames";
import Incomingvideocall from "../../utils/incoming-video-call";

export default function Home({ navigation }) {
  const [number, setNumber] = useState("");
  const [fcmToken, setfcmToken] = useState("");
  const [displayNum, setDisplayNum] = useState(null);
  const [isCalling, setisCalling] = useState(false);
  const [videosdkToken, setVideosdkToken] = useState(null);
  const [videosdkMeeting, setVideosdkMeeting] = useState(null);

  const videosdkTokenRef = useRef();
  const videosdkMeetingRef = useRef();
  videosdkTokenRef.current = videosdkToken;
  videosdkMeetingRef.current = videosdkMeeting;

  useEffect(() => {
    async function getFCMtoken() {
      const token = await messaging().getToken();
      setfcmToken(token);
    }

    async function getTokenAndMeetingId() {
      const videoSDKtoken = getToken();
      const videoSDKMeetingId = await createMeeting({ token: videoSDKtoken });
      setVideosdkToken(videoSDKtoken);
      setVideosdkMeeting(videoSDKMeetingId);
    }
    getFCMtoken();
    getTokenAndMeetingId();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      const { token, meetingId, callerName, callerFCM, type } =
        remoteMessage.data;
      console.log("HOME--- TYPE", type);
      switch (type) {
        case "CALL_INITIATED":
          const incomingCallAnswer = ({ callUUID }) => {
            updateCallStatus({
              fcmToken: callerFCM,
              type: "ACCEPTED",
            });
            Incomingvideocall.endIncomingcallAnswer(callUUID);
            setisCalling(false);
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

          break;
        case "ACCEPTED":
          setisCalling(false);
          navigation.navigate(SCREEN_NAMES.Meeting, {
            name: "Person B",
            token: videosdkTokenRef.current,
            meetingId: videosdkMeetingRef.current,
          });
          break;
        case "REJECTED":
          Toast.show("Call Rejected");
          setisCalling(false);
          break;
        case "DISCONNECT":
          Incomingvideocall.endIncomingcallAnswer();
          break;
        default:
          Toast.show("Call Could not placed");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function checkTokenExist() {
      if (fcmToken) {
        const querySnapshot = await firestore()
          .collection("users")
          .where("token", "==", fcmToken)
          .get();
        const uids = querySnapshot.docs.map((doc) => {
          if (doc && doc?.data()?.callerId) {
            setDisplayNum(doc?.data()?.callerId);
          }
          return doc;
        });

        if (uids && uids.length == 0) {
          addUser();
        } else {
          console.log("Token Found");
        }
      }
    }
    checkTokenExist();
  }, [fcmToken]);

  const addUser = () => {
    const obj = {
      callerId: Math.floor(10000000 + Math.random() * 90000000).toString(),
      token: fcmToken,
    };
    firestore()
      .collection("users")
      .add(obj)
      .then(() => {
        console.log("User added!");
        setDisplayNum(obj.callerId);
      });
  };

  const getCallee = async (num) => {
    const querySnapshot = await firestore()
      .collection("users")
      .where("callerId", "==", num.toString())
      .get();
    return querySnapshot.docs.map((doc) => {
      return doc;
    });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        backgroundColor: colors.primary["900"],
        justifyContent: "center",
        paddingHorizontal: 42,
      }}
    >
      {!isCalling ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <View
              style={{
                padding: 35,
                backgroundColor: "#1A1C22",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 14,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "#D0D4DD",
                  fontFamily: ROBOTO_FONTS.Roboto,
                }}
              >
                Your Caller ID
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 36,
                    color: "#ffff",
                    letterSpacing: 8,
                    fontFamily: ROBOTO_FONTS.Roboto,
                  }}
                >
                  {displayNum ? displayNum : "Loading.."}
                </Text>
                <TouchableOpacity
                  style={{
                    height: 30,
                    aspectRatio: 1,
                    backgroundColor: "#2B3034",
                    marginLeft: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 4,
                  }}
                  onPress={() => {
                    Clipboard.setString(displayNum);
                    Toast.show("Copied");
                    Alert.alert(
                      "Information",
                      "This callerId will be unavailable, once you uninstall the App."
                    );
                  }}
                >
                  <Copy fill={colors.primary[100]} width={16} height={16} />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#1A1C22",
                padding: 40,
                marginTop: 25,
                justifyContent: "center",
                borderRadius: 14,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "#D0D4DD",
                  fontFamily: ROBOTO_FONTS.Roboto,
                }}
              >
                Enter call id of another user
              </Text>
              <TextInputContainer
                placeholder={"Enter Caller ID"}
                value={number}
                setValue={setNumber}
                keyboardType={"number-pad"}
              />
              <TouchableOpacity
                onPress={async () => {
                  if (number) {
                    const data = await getCallee(number);
                    if (data) {
                      if (data.length === 0) {
                        Toast.show("CallerId Does not Match");
                      } else {
                        Toast.show("CallerId Match!");
                        initiateCall({
                          calleeFCM: data[0]?.data()?.token,
                          callerFCM: fcmToken,
                          videosdkToken: videosdkTokenRef.current,
                          videosdkMeeting: videosdkMeetingRef.current,
                        });
                        setisCalling(true);
                      }
                    }
                  } else {
                    Toast.show("Please provide CallerId");
                  }
                }}
                style={{
                  height: 50,
                  backgroundColor: "#5568FE",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 12,
                  marginTop: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  Call Now
                </Text>
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      ) : (
        <View style={{ flex: 1, justifyContent: "space-around" }}>
          <View
            style={{
              padding: 35,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 14,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#D0D4DD",
                fontFamily: ROBOTO_FONTS.Roboto,
              }}
            >
              Calling to...
            </Text>

            <Text
              style={{
                fontSize: 36,
                marginTop: 12,
                color: "#ffff",
                letterSpacing: 8,
                fontFamily: ROBOTO_FONTS.Roboto,
              }}
            >
              {number}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                const data = await getCallee(number);
                if (data) {
                  const token = data[0]?.data()?.token;
                  updateCallStatus({
                    fcmToken: token,
                    type: "DISCONNECT",
                  });
                  setisCalling(false);
                }
              }}
              style={{
                backgroundColor: "#FF5D5D",
                borderRadius: 30,
                height: 60,
                aspectRatio: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CallEnd width={50} height={12} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
