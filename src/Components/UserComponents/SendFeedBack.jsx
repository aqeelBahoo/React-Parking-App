import firebase from "firebase/app";
import "firebase/auth";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import React, { useState } from "react";

const SendFeedBack = (props) => {
  const [feedBack, setFeedBack] = useState("");

  const sendfeedback = () => {
    if (!feedBack) {
      return;
    }
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
        var userId = firebase.auth().currentUser.uid;
        var rootRef = firebase.database().ref();
        const speedRef = rootRef.child("Feedbacks/").push();
        speedRef.set({
          FeedBack: feedBack,
          userId: userId,
        });
        setFeedBack("");
      }
    });
  };

  return (
    <div>
      <MuiThemeProvider>
        <div>
          <br />
          <br />
          <br />
          <TextField
            hintText="Please Enter your Feedback"
            floatingLabelText="Your FeedBack"
            value={feedBack}
            onChange={(event, val) => setFeedBack(val)}
          />
          <br />

          <RaisedButton
            label="Submit"
            primary={true}
            style={style}
            onClick={sendfeedback}
          />
        </div>
      </MuiThemeProvider>
    </div>
  );
};

export default SendFeedBack;

const style = {
  margin: 15,
};
