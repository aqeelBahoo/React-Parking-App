import firebase from "firebase/app";
import "firebase/auth";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

const firebaseConfig = {
  apiKey: "AIzaSyD-KL5v30kjn0A6papx35A1AZ6zIAVLdc4",
  authDomain: "smart-parking-app-1d516.firebaseapp.com",
  projectId: "smart-parking-app-1d516",
  storageBucket: "smart-parking-app-1d516.appspot.com",
  messagingSenderId: "1037443207231",
  appId: "1:1037443207231:web:221dbf3bbd8b447997288a",
};
firebase.initializeApp(firebaseConfig);

ReactDOM.render(<App />, document.getElementById("root"));
