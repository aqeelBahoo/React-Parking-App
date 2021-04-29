import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

export default class Logout extends Component {
  handleClick() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.history.push("/");
      });
  }
  render() {
    return (
      <div id="navigation">
        <MuiThemeProvider>
          <div>
            <RaisedButton
              label="Log_Out"
              primary={true}
              style={style}
              onClick={this.handleClick}
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
