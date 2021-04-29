import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";
import "../../App.css";

export default class ViewAllUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isReqPending: false,
    };
  }

  componentDidMount() {
    this.setState({ isReqPending: true });
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
        const rootRef = firebase.database().ref();
        const speedRef = rootRef.child("Users/");
        speedRef.on("value", (snap) => {
          let users = snap.val();
          if (!users) {
            this.setState({ isReqPending: false });
            return;
          }
          users = Object.keys(users)
            .map((u) => users[u])
            .filter((u) => !u.admin);

          this.setState({
            users: users,
            isReqPending: false,
          });
        });
      }
    });
  }
  render() {
    return (
      <div>
        <h3>All Users</h3>
        <MuiThemeProvider>
          <div>
            <div className={!this.state.isReqPending ? "hidden" : undefined}>
              All Users Loading...
            </div>
            <div className={this.state.isReqPending ? "hidden" : undefined}>
              {this.state.users.map((item, index) => (
                <div key={index}>
                  <Paper
                    key={index}
                    className="location"
                    zDepth={3}
                    rounded={false}
                    id="abc"
                  >
                    <p>
                      Name : {item.name}
                      <br />
                    </p>
                    <p>
                      Email: {item.email}
                      <br />
                    </p>
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
