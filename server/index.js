const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
var fcm = require("fcm-notification");
var FCM = new fcm("./serviceAccountKey.json");
var Key = "./AuthKey_93JKT8SSVF.p8";
const app = express();
var apn = require("apn");
const { v4: uuidv4 } = require("uuid");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/initiate-call", (req, res) => {
  console.log("BODY", req.body);
  const { calleeInfo, callerInfo, videoSDKInfo } = req.body;

  if (calleeInfo.platform === "iOS") {
    let deviceToken = calleeInfo.token;
    var options = {
      token: {
        key: Key,
        keyId: "93JKT8SSVF",
        teamId: "8GZ776NSU2",
      },
      production: false,
    };

    var apnProvider = new apn.Provider(options);

    var note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 1;
    note.sound = "ping.aiff";
    note.alert = "You have a new message";
    note.rawPayload = {
      callerName: callerInfo.name,
      aps: {
        "content-available": 1,
      },
      handle: callerInfo.name,
      callerInfo,
      videoSDKInfo,
      type: "CALL_INITIATED",
      uuid: uuidv4(),
    };
    note.pushType = "voip";
    note.topic = "org.reactjs.ReactNativeCallTrigger.voip";
    apnProvider.send(note, deviceToken).then((result) => {
      console.log("RESULT", result);
      res.send(result);
    });
  } else if (calleeInfo.platform === "ANDROID") {
    var FCMtoken = calleeInfo.token;
    var message = {
      data: {
        callerInfo,
        videoSDKInfo,
        type: "CALL_INITIATED",
      },
      android: {
        priority: "high",
      },
      token: FCMtoken,
    };

    FCM.send(message, function (err, response) {
      if (err) {
        console.log("error found", err);
        res.send(err);
      } else {
        res.send(response);

        console.log("response here", response);
      }
    });
  } else {
    res.send("Not supported platform");
  }
});

app.post("/update-call", (req, res) => {
  const { callerInfo, type } = req.body;
  console.log("BODY", { callerInfo, type });
  if (callerInfo.platform === "iOS") {
    let deviceToken = callerInfo.token;
    var options = {
      token: {
        key: Key,
        keyId: "93JKT8SSVF",
        teamId: "8GZ776NSU2",
      },
      production: false,
    };

    var apnProvider = new apn.Provider(options);

    var note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 1;
    note.sound = "ping.aiff";
    note.alert = "You have a new message";
    note.rawPayload = {
      aps: {
        "content-available": 1,
      },
      type: type,
      uuid: uuidv4(),
    };
    apnProvider.send(note, deviceToken).then((result) => {
      console.log("RESULT", result);
      res.send(result);
    });
  } else if (calleeInfo.platform === "ANDROID") {
    var message = {
      data: {
        type: type,
      },
      token: FCMToken,
    };

    console.log("message", message);
    FCM.send(message, function (err, response) {
      if (err) {
        console.log("error found", err);
      } else {
        console.log("response here", response);
      }
    });
  }
});

app.listen(9000, () => {
  console.log(`API server listening at http://localhost:9000`);
});
