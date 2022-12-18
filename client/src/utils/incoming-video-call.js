import RNCallKeep from "react-native-callkeep";
import uuid from "react-native-uuid";

class IncomingCall {
  constructor() {
    this.currentCallId = null;
  }

  configure = (incomingcallAnswer, endIncomingCall) => {
    try {
      RNCallKeep.setup({
        android: {
          alertTitle: "Permissions required",
          alertDescription:
            "This application needs to access your phone accounts",
          cancelButton: "Cancel",
          okButton: "Ok",
        },
      });
      RNCallKeep.setAvailable(true);
      RNCallKeep.addEventListener("answerCall", incomingcallAnswer);
      RNCallKeep.addEventListener("endCall", endIncomingCall);
    } catch (error) {
      console.error("initializeCallKeep error:", error?.message);
    }
  };

  // Use startCall to ask the system to start a call - Initiate an outgoing call from this point
  startCall = ({ handle, localizedCallerName }) => {
    // Your normal start call action
    RNCallKeep.startCall(this.getCurrentCallId(), handle, localizedCallerName);
  };

  reportEndCallWithUUID = (callUUID, reason) => {
    RNCallKeep.reportEndCallWithUUID(callUUID, reason);
  };

  endIncomingcallAnswer = () => {
    RNCallKeep.endCall(this.currentCallId);
    this.currentCallId = null;
    this.removeEvents();
  };

  removeEvents = () => {
    RNCallKeep.removeEventListener("answerCall");
    RNCallKeep.removeEventListener("endCall");
  };

  displayIncomingCall = (callerName) => {
    RNCallKeep.setAvailable(false);
    RNCallKeep.displayIncomingCall(
      this.getCurrentCallId(),
      callerName,
      callerName,
      "number",
      true,
      null
    );
  };

  backToForeground = () => {
    RNCallKeep.backToForeground();
  };

  getCurrentCallId = () => {
    if (!this.currentCallId) {
      this.currentCallId = uuid.v4();
    }
    return this.currentCallId;
  };
}

export default Incomingvideocall = new IncomingCall();
