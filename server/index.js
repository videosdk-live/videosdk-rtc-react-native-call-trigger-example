const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
var fcm = require("fcm-notification");
var FCM = new fcm("./serviceAccountKey.json");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/initiate-call", (req, res) => {
  const { token, meetingId, callerName, calleeFCM, callerFCM } = req.body;

  var FCMtoken = calleeFCM;
  console.log("FCM TOKEN", FCMtoken);
  var message = {
    data: {
      token,
      meetingId,
      callerName,
      callerFCM,
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
    } else {
      console.log("response here", response);
    }
  });
});

app.post("/update-call", (req, res) => {
  const { FCMToken, type } = req.body;
  console.log("BODY", { body: req.body });
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
});

app.listen(9000, () => {
  console.log(`API server listening at http://localhost:9000`);
});
