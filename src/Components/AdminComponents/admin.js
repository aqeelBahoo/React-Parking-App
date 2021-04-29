import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import firebase from "firebase/app";
import "firebase/auth";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
import AddParkingLocation from "./AddParkingLocation";
import ParkingLocation from "./ParkingLocation";
import LocationDetail from "./locationDetail";
import ViewAllUser from "./ViewAllUser";
import ViewAllBooking from "./ViewAllBooking";
import UserFeedback from "./UserFeedBack";
import { Route } from "react-router-dom";

export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleToggle = () => this.setState({ open: !this.state.open });
  handleClose = () => this.setState({ open: false });

  handleClick() {
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
    this.props.history.push(`/Admin/${endpoint}`);
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar
              title={<span>Administrator</span>}
              onClick={this.handleToggle}
              iconElementRight={
                <FlatButton
                  label="Log out"
                  onClick={(event) => this.handleClick(event)}
                />
              }
            />
            <div>
              <Drawer open={this.state.open}>
                <MenuItem onClick={this.handleToggle.bind(this)}> X </MenuItem>
                <MenuItem onClick={() => this.goto("AddParkingLocation")}>
                  Add Parking Locations
                </MenuItem>
                <MenuItem onClick={() => this.goto("ParkingLocation")}>
                  View parking Locations
                </MenuItem>
                <MenuItem onClick={() => this.goto("ViewAllUser")}>
                  View All Users
                </MenuItem>
                <MenuItem onClick={() => this.goto("ViewAllBooking")}>
                  View All Booking
                </MenuItem>
                <MenuItem onClick={() => this.goto("UserFeedback")}>
                  Users feedbacks
                </MenuItem>
              </Drawer>
            </div>

            <Route
              path="/Admin/AddParkingLocation"
              component={AddParkingLocation}
            />
            <Route path="/Admin/ParkingLocation" component={ParkingLocation} />
            <Route path="/Admin/LocationDetail" component={LocationDetail} />
            <Route path="/Admin/ViewAllUser" component={ViewAllUser} />
            <Route path="/Admin/ViewAllBooking" component={ViewAllBooking} />
            <Route path="/Admin/UserFeedback" component={UserFeedback} />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
