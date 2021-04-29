import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import firebase from "firebase/app";
import "firebase/auth";
import "../App.css";
import Alert from "@material-ui/lab/Alert";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      userId: null,
      unAuthorized: false,
      isReqPending: false,
    };
  }
  handleSignin(event) {
    if (!this.state.username || !this.state.password) {
      return;
    }
    this.setState({ isReqPending: true });

    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.username, this.state.password)
      .then(() => {
        var userId = firebase.auth().currentUser.uid;
        this.setState({ userId: userId });
        const rootRef = firebase.database().ref();
        const speedRef = rootRef.child("Users/" + userId);
        speedRef.on("value", (snap) => {
          const value = snap.val();
          if (!value) {
            this.setState({ unAuthorized: true, isReqPending: false });
            return;
          }

          if (value.admin) {
            this.props.history.push("/Admin");
          } else {
            this.props.history.push("/User");
          }
        });
      })
      .catch((error) => {
        this.setState({ unAuthorized: true, isReqPending: false });
      });
  }

  signup() {
    this.props.history.push("/SignUp");
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <br></br> <br></br> <br></br> <br></br>
            <TextField
              hintText="Enter your E-Mail"
              floatingLabelText="E-Mail"
              onChange={(event, newValue) =>
                this.setState({ username: newValue })
              }
            />
            <br />
            <TextField
              type="password"
              hintText="Enter your Password"
              floatingLabelText="Password"
              onChange={(event, newValue) =>
                this.setState({ password: newValue })
              }
            />
            <br />
            <RaisedButton
              label="Sign in"
              primary={true}
              style={style}
              disabled={this.state.isReqPending}
              onClick={(event) => this.handleSignin(event)}
            />
            <div>
              <RaisedButton
                label="go to Register"
                secondary={true}
                style={style}
                onClick={() => this.signup()}
              />
            </div>
            <div className={!this.state.unAuthorized ? "hidden" : undefined}>
              <Alert severity="error">Email or Passwors incorrect!</Alert>
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
const style = {
  margin: 15,
};
