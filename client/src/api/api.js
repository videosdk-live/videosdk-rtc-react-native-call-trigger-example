const API_BASE_URL = "https://api.videosdk.live/v2";
const VIDEOSDK_TOKEN = process.env.REACT_APP_VIDEOSDK_TOKEN;
const FCM_SERVER_URL = "http://192.168.1.10:9000";

export const getToken = () => {
  return VIDEOSDK_TOKEN;
};

export const createMeeting = async ({ token }) => {
  const url = `${API_BASE_URL}/rooms`;
  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  const { roomId } = await fetch(url, options)
    .then((response) => response.json())
    .catch((error) => console.error("error", error));

  return roomId;
};

export const initiateCall = async ({
  calleeFCM,
  callerFCM,
  videosdkToken,
  videosdkMeeting,
}) => {
  await fetch(`${FCM_SERVER_URL}/initiate-call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: videosdkToken,
      meetingId: videosdkMeeting,
      calleeFCM,
      callerName: "Person A",
      callerFCM,
    }),
  })
    .then((response) => {
      console.log(" RESP", response);
    })
    .catch((error) => console.error("error", error));
};

export const updateCallStatus = async ({ fcmToken, type }) => {
  await fetch(`${FCM_SERVER_URL}/update-call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      FCMToken: fcmToken,
      type,
    }),
  })
    .then((response) => {
      console.log("##RESP", response);
    })
    .catch((error) => console.error("error", error));
};
