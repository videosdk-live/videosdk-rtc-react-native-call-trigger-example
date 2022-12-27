const functions = require("firebase-functions");
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
  const { calleeInfo, callerInfo, videoSDKInfo } = req.body;

  if (calleeInfo.platform === "iOS") {
    let deviceToken = calleeInfo.APN;
    var options = {
      token: {
        key: Key,
        keyId: "YOUR_KEY_ID",
        teamId: "YOUR_TEAM_ID",
      },
      production: true,
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
      if (result.failed && result.failed.length > 0) {
        console.log("RESULT", result.failed[0].response);
        res.status(400).send(result.failed[0].response);
      } else {
        res.status(200).send(result);
      }
    });
  } else if (calleeInfo.platform === "ANDROID") {
    var FCMtoken = calleeInfo.token;
    const info = JSON.stringify({
      callerInfo,
      videoSDKInfo,
      type: "CALL_INITIATED",
    });
    var message = {
      data: {
        info,
      },
      android: {
        priority: "high",
      },
      token: FCMtoken,
    };
    FCM.send(message, function (err, response) {
      if (err) {
        res.status(200).send(response);
      } else {
        res.status(400).send(response);
      }
    });
  } else {
    res.status(400).send("Not supported platform");
  }
});

app.post("/update-call", (req, res) => {
  const { callerInfo, type } = req.body;
  const info = JSON.stringify({
    callerInfo,
    type,
  });

  var message = {
    data: {
      info,
    },
    apns: {
      headers: {
        "apns-priority": "10",
      },
      payload: {
        aps: {
          badge: 1,
        },
      },
    },
    token: callerInfo.token,
  };

  FCM.send(message, function (err, response) {
    if (err) {
      res.status(200).send(response);
    } else {
      res.status(400).send(response);
    }
  });
});

app.listen(9000, () => {
  console.log(`API server listening at http://localhost:9000`);
});

exports.app = functions.https.onRequest(app);
