// database/firebaseDb.js
import * as firebase from "firebase";
const firebaseConfig = {
  apiKey: "XXXXXXXXXXXXXXXXXXXXX",
  authDomain: "react-native-callkit.firebaseapp.com",
  projectId: "react-native-callkit",
  storageBucket: "react-native-callkit.appspot.com",
  messagingSenderId: "XXXXXXXXXXXXXX",
  appId: "XXXXXXXXXXXXXXXXXXXXXXX",
  measurementId: "xxxxxxxxxxxxxxxxxxxxxxxx",
};
firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
