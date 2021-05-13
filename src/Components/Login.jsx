import Alert from "@material-ui/lab/Alert";
import firebase from "firebase/app";
import "firebase/auth";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import React, { useState } from "react";
import "../App.css";

const Login = (props) => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [isReqPending, setReqPending] = useState(false);
  const [userId, setUserId] = useState("");
  const [unAuthorized, setUnAuthorized] = useState(false);

  const handleSignin = () => {
    if (!user.username || !user.password) {
      return;
    }
    setReqPending(true);

    firebase
      .auth()
      .signInWithEmailAndPassword(user.username, user.password)
      .then(() => {
        var userId = firebase.auth().currentUser.uid;
        setUserId({ userId });
        const rootRef = firebase.database().ref();
        const speedRef = rootRef.child("Users/" + userId);
        speedRef.on("value", (snap) => {
          const value = snap.val();
          if (!value) {
            setUnAuthorized(true);
            setReqPending(false);
            return;
          }
          if (value.admin) {
            props.history.push("/Admin");
          } else {
            props.history.push("/User");
          }
        });
      })
      .catch((error) => {
        setUnAuthorized(true);
        setReqPending(false);
      });
  };

  const signup = () => {
    props.history.push("/SignUp");
  };

  return (
    <div>
      <MuiThemeProvider>
        <div>
          <h3>Real-Time Car Parking Booking</h3>
          <br></br> <br></br>
          <TextField
            hintText="Enter your E-Mail"
            floatingLabelText="E-Mail"
            onChange={(event, value) => setUser({ ...user, username: value })}
          />
          <br />
          <TextField
            type="password"
            hintText="Enter your Password"
            floatingLabelText="Password"
            onChange={(event, value) => setUser({ ...user, password: value })}
          />
          <br />
          <RaisedButton
            label="Sign in"
            primary={true}
            disabled={isReqPending}
            onClick={(event) => handleSignin()}
          />
          <div>
            <RaisedButton
              label="go to Register"
              secondary={true}
              onClick={() => signup()}
            />
          </div>
          <div className={!unAuthorized ? "hidden" : undefined}>
            <Alert severity="error">Email or Passwors incorrect!</Alert>
          </div>
        </div>
      </MuiThemeProvider>
    </div>
  );
};

export default Login;
