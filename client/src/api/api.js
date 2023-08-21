const API_BASE_URL = "https://api.videosdk.live/v2";
const VIDEOSDK_TOKEN = process.env.REACT_APP_VIDEOSDK_TOKEN;

const FCM_SERVER_URL = "LOCAL_SERVER_URL:9000";

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
  callerInfo,
  calleeInfo,
  videoSDKInfo,
}) => {
  await fetch(`${FCM_SERVER_URL}/initiate-call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callerInfo,
      calleeInfo,
      videoSDKInfo,
    }),
  })
    .then((response) => {
      console.log(" RESP", response);
    })
    .catch((error) => console.error("error", error));
};

export const updateCallStatus = async ({ callerInfo, type }) => {
  await fetch(`${FCM_SERVER_URL}/update-call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callerInfo,
      type,
    }),
  })
    .then((response) => {
      console.log("##RESP", response);
    })
    .catch((error) => console.error("error", error));
};
