import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";

export default class MyFeedBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbacks: [],
      isReqPending: false,
      isMounted: true,
    };
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }
  componentDidMount() {
    this.setState({
      isReqPending: true,
    });
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
        var userId = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref("Feedbacks/")
          .orderByChild("userId")
          .equalTo(userId)
          .on("value", (snap) => {
            var feedbacks = snap.val();
            if (feedbacks) {
              const data = Object.keys(feedbacks).map(
                (f) => feedbacks[f].FeedBack
              );
              this.setState({
                feedbacks: data,
                isReqPending: false,
              });
            } else {
              this.setState({
                isReqPending: false,
              });
            }
          });
      }
    });
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div className="add-location">
            <h3>My Feedbacks</h3>
            <div className={!this.state.isReqPending ? "hidden" : undefined}>
              Feedbacks Loading...
            </div>
            <div className={this.state.isReqPending ? "hidden" : undefined}>
              {this.state.feedbacks.map((feedback, index) => (
                <div key={index}>
                  <Paper
                    key={index}
                    className="feedback"
                    zDepth={4}
                    rounded={false}
                  >
                    <p> FeedBack : {feedback}</p>
                  </Paper>
                </div>
              ))}
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
