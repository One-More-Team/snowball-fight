import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import ReduxSagaFirebase from "redux-saga-firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDyY49Ga3v6yZjDht8oVBLEZ3YLPlgySr4",
  authDomain: "snowball-fight-bbec7.firebaseapp.com",
  databaseURL: "https://snowball-fight-bbec7.firebaseio.com",
  projectId: "snowball-fight-bbec7",
  storageBucket: "snowball-fight-bbec7.appspot.com",
  messagingSenderId: "447598204768",
  appId: "1:447598204768:web:aa179c1394d4d7aa8cf005",
  measurementId: "G-JHLMXPHKXR",
};

firebase.initializeApp(firebaseConfig);
export const rsf = new ReduxSagaFirebase(firebase);
