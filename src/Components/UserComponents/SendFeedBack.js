import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import firebase from "firebase/app";
import "firebase/auth";
export default class SendFeedBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedBack: "",
    };
  }

  sendfeedback() {
    if (!this.state.feedBack) {
      return;
    }
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
        var userId = firebase.auth().currentUser.uid;
        var rootRef = firebase.database().ref();
        const speedRef = rootRef.child("Feedbacks/").push();
        speedRef.set({
          FeedBack: this.state.feedBack,
          userId: userId,
        });
        this.setState({ feedBack: "" });
      }
    });
  }

  render() {
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
              value={this.state.feedBack}
              onChange={(event, val) => this.setState({ feedBack: val })}
            />
            <br />

            <RaisedButton
              label="Submit"
              primary={true}
              style={style}
              onClick={this.sendfeedback.bind(this)}
            />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

const style = {
  margin: 15,
};
