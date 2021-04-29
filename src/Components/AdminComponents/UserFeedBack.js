import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";
import "../../App.css";

export default class UserFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbacks: [],
      isReqPending: false,
    };
  }
  componentDidMount() {
    this.setState({ isReqPending: true });
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
        firebase
          .database()
          .ref("Feedbacks/")
          .on("value", (snap) => {
            var userobj = snap.val();
            if (!userobj) {
              this.setState({ isReqPending: false });
              return;
            }
            var keys = Object.keys(userobj);
            const d = keys.map((f, i) => {
              return {
                id: f,
                feedback: userobj[f].FeedBack,
              };
            });
            this.setState({
              feedbacks: d,
            });
            this.setState({ isReqPending: false });
          });
      }
    });
  }
  Delete(id) {
    firebase
      .database()
      .ref("Feedbacks/" + id)
      .remove();
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <h3>User Feedback</h3>
            <div className={!this.state.isReqPending ? "hidden" : undefined}>
              Feedbacks Loading...
            </div>
            <div className={this.state.isReqPending ? "hidden" : undefined}>
              {this.state.feedbacks.map((item, index) => (
                <div key={index}>
                  <Paper
                    key={index}
                    className="location"
                    zDepth={4}
                    rounded={false}
                  >
                    <p> FeedBack : {item.feedback}</p>

                    <RaisedButton
                      label="Delete"
                      primary={true}
                      onClick={this.Delete.bind(this, item.id)}
                    />
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
