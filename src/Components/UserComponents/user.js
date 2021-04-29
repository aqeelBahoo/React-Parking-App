import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import firebase from "firebase/app";
import "firebase/auth";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
import MyBooking from "./MyBooking";
import SendFeedBack from "./SendFeedBack";
import ParkingLocation from "./ParkingLocation";
import MyFeedback from "./MyFeedBack";
import { Route } from "react-router-dom";
import LocationDetail from "./locationDetail";

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }
  handleToggle = () => this.setState({ open: !this.state.open });
  logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {})
      .catch(function (error) {});
    this.props.history.push("/");
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
      } else {
        this.props.history.push("/");
      }
    });
  }
  goto(endpoint) {
    this.props.history.push(`/User/${endpoint}`);
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar
              title={<span style={styles.title}>Welcome User</span>}
              onClick={this.handleToggle}
              iconElementRight={
                <FlatButton
                  label="Log out"
                  onClick={(event) => this.logout(event)}
                />
              }
            />
            <div>
              <Drawer open={this.state.open}>
                <MenuItem onClick={this.handleToggle.bind(this)}> X </MenuItem>

                <MenuItem onClick={this.goto.bind(this, "ParkingLocation")}>
                  Parking Locations
                </MenuItem>
                <MenuItem onClick={this.goto.bind(this, "MyBooking")}>
                  My Booking
                </MenuItem>
                <MenuItem onClick={this.goto.bind(this, "MyFeedBack")}>
                  My Feedback
                </MenuItem>
                <MenuItem onClick={this.goto.bind(this, "SendFeedBack")}>
                  Send Feedback
                </MenuItem>
              </Drawer>
            </div>
            <Route path="/User/ParkingLocation" component={ParkingLocation} />
            <Route path="/User/MyBooking" component={MyBooking} />
            <Route path="/User/SendFeedBack" component={SendFeedBack} />
            <Route path="/User/MyFeedBack" component={MyFeedback} />
            <Route path="/User/LocationDetail" component={LocationDetail} />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

const styles = {
  title: {
    cursor: "pointer",
  },
};
