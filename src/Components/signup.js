import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import Alert from "@material-ui/lab/Alert";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      type: "",
      hasError: false,
      isReqPending: false,
      errorMessage: "",
      success: false,
    };
  }

  handleSubmit(event) {
    if (!this.state.email || !this.state.password) {
      return;
    }
    this.setState({ isReqPending: true });
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.setState({ success: true });
        var uid = firebase.auth().currentUser.uid;
        firebase.database().ref(`Users/${uid}`).set({
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
        });
        this.props.history.push("/");
      })
      .catch((error) => {
        this.setState({
          hasError: true,
          errorMessage: error?.message,
          isReqPending: true,
        });
      });
  }

  signin() {
    this.props.history.push("/");
  }

  render() {
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
              onChange={(event, newValue) => this.setState({ name: newValue })}
            />
            <br />
            <TextField
              hintText="Enter your Email"
              type="email"
              floatingLabelText="Email"
              onChange={(event, newValue) => this.setState({ email: newValue })}
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
              label="Submit"
              primary={true}
              disabled={this.state.isReqPending}
              style={style}
              onClick={(event) => this.handleSubmit(event)}
            />
            <div>
              <RaisedButton
                label="Go to Sign in"
                secondary={true}
                style={style}
                onClick={() => this.signin()}
              />
            </div>
            <div className={!this.state.hasError ? "hidden" : undefined}>
              <Alert severity="error">{this.state.errorMessage}!</Alert>
            </div>{" "}
            <div className={!this.state.success ? "hidden" : undefined}>
              <Alert severity="success">Account Created Successfully.</Alert>
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
export default SignUp;
