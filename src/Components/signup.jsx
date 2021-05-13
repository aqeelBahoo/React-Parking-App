import Alert from "@material-ui/lab/Alert";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import React, { useState } from "react";

const SignUp = (props) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isReqPending, setReqPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event) => {
    if (!user.email || !user.password) {
      return;
    }
    setReqPending(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(() => {
        setSuccess(true);
        var uid = firebase.auth().currentUser.uid;
        firebase.database().ref(`Users/${uid}`).set({
          name: user.name,
          email: user.email,
          password: user.password,
        });
        props.history.push("/");
      })
      .catch((error) => {
        setError(error?.message);
        setReqPending(false);
      });
  };

  const signin = () => {
    props.history.push("/");
  };

  return (
    <div>
      <MuiThemeProvider>
        <div>
          <AppBar style={{ backgroundColor: "#2196F3" }} title="Register" />
          <br></br>
          <br></br>
          <br></br>
          <TextField
            hintText="Enter your Full Name"
            floatingLabelText="Name"
            onChange={(event, value) => setUser({ ...user, name: value })}
          />
          <br />
          <TextField
            hintText="Enter your Email"
            type="email"
            floatingLabelText="Email"
            onChange={(event, value) => setUser({ ...user, email: value })}
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
            label="Submit"
            primary={true}
            disabled={isReqPending}
            onClick={(event) => handleSubmit(event)}
          />
          <div>
            <RaisedButton
              label="Go to Sign in"
              secondary={true}
              onClick={() => signin()}
            />
          </div>
          <div className={!error ? "hidden" : undefined}>
            <Alert severity="error">{error}!</Alert>
          </div>{" "}
          <div className={!success ? "hidden" : undefined}>
            <Alert severity="success">Account Created Successfully.</Alert>
          </div>
        </div>
      </MuiThemeProvider>
    </div>
  );
};

export default SignUp;
