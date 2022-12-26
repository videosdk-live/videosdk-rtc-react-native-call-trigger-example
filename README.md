# React native Call Trigger with VideoSDK

## Platforms

- [x] Android
- [x] iOS

Let's keep a watch on the third-party libraries utilised in this repository before moving on.

1. [React Native CallKeep](https://www.npmjs.com/package/react-native-callkeep)
2. [React Native VoIP Push Notification](https://www.npmjs.com/package/react-native-voip-push-notification)
3. [VideoSDK RN Android Overlay Permission](https://www.npmjs.com/package/videosdk-rn-android-overlay-permission)

## Client

## iOS Setup

Please follow the guidance of [iOS setup](./iOS_SETUP.md)

---

## Android Setup

### Step 1: Clone the sample project

Clone the repository to your local environment.

```js
https://github.com/videosdk-live/videosdk-rtc-react-native-call-trigger-example.git
```

### Step 2: Go to client folder

```js
cd client
```

### Step 3: Copy the .env.example file to .env file

Open your favorite code editor and copy `.env.example` to `.env` file.

```js
cp.env.example.env;
```

### Step 4: Modify .env file

Generate temporary token from [Video SDK Account](https://app.videosdk.live/signup) and add it to `.env` file.

```js title=".env"
REACT_APP_VIDEOSDK_TOKEN = "TEMPORARY-TOKEN";
```

### Step 5: Setup Firebase

#### FCM setup

- Replace your firebase app `google-services.json` file at `/android/app/google-services.json`

#### Firestore setup

- Create web app in your firebase project and replace configuration at `client/database/firebaseDb.js`
- Add `users` collection in firestore database.

![plot](./public/image-1.png)

### Step 6: Install packages and run the project

```js
npm install
```

```js
npm run android
```

_**NOTE : It is necesary to setup local server before run the project.**_

## Server Setup

### Step 1: Go to server folder

```js
cd server
```

### Step 2: Setup Firebase Admin SDK for managing FCM

Download private Key from firebase and repplace it with `server/serviceAccountKey.json`
![plot](./public/image-3.png)

### Step 3: Install Package and start server

```js
npm install
```

```js
npm run start
```

### Step 4: Add local server url in client

Add Local server ip address in `client/api/api.js` file.

```js title="api.js"
const FCM_SERVER_URL = "http://192.168.1.10:9000";
```

## Issue

You can generate the issue on [Github](https://github.com/videosdk-live/videosdk-rtc-react-native-call-trigger-example/issues) or ping us on [Discord](https://discord.gg/bsEukaNhrD)

## Other Information

### Tested on Devices

- Samsung
- Xiomi
- Realme
- Oppo

### Upcoming Feature

- Recieves call when app is background
- Recieves call when lock screen - _COMING SOON_
