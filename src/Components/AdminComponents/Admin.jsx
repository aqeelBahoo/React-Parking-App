import firebase from "firebase/app";
import "firebase/auth";
import AppBar from "material-ui/AppBar";
import Drawer from "material-ui/Drawer";
import FlatButton from "material-ui/FlatButton";
import MenuItem from "material-ui/MenuItem";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import AddParkingLocation from "./AddParkingLocation";
import LocationDetail from "./LocationDetail";
import ParkingLocations from "./ParkingLocations";
import UserFeedback from "./UserFeedBack";
import ViewAllBooking from "./ViewAllBookings";
import ViewAllUser from "./ViewAllUser";

const Admin = (props) => {
  const [opened, setOpen] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
      } else {
        props.history.push("/");
      }
    });
  }, []);

  const goto = (endpoint) => {
    props.history.push(`/Admin/${endpoint}`);
  };

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {});
    props.history.push("/");
  };

  return (
    <div>
      <MuiThemeProvider>
        <div>
          <AppBar
            title={<span>Administrator</span>}
            onClick={() => setOpen(!opened)}
            iconElementRight={
              <FlatButton label="Log out" onClick={() => handleLogout()} />
            }
          />
          <div>
            <Drawer open={opened}>
              <MenuItem onClick={() => setOpen(!opened)}> X </MenuItem>
              <MenuItem onClick={() => goto("AddParkingLocation")}>
                Add Parking Locations
              </MenuItem>
              <MenuItem onClick={() => goto("ParkingLocation")}>
                View parking Locations
              </MenuItem>
              <MenuItem onClick={() => goto("ViewAllUser")}>
                View All Users
              </MenuItem>
              <MenuItem onClick={() => goto("ViewAllBooking")}>
                View All Booking
              </MenuItem>
              <MenuItem onClick={() => goto("UserFeedback")}>
                Users feedbacks
              </MenuItem>
            </Drawer>
          </div>

          <Route
            path="/Admin/AddParkingLocation"
            component={AddParkingLocation}
          />
          <Route path="/Admin/ParkingLocation" component={ParkingLocations} />
          <Route path="/Admin/LocationDetail" component={LocationDetail} />
          <Route path="/Admin/ViewAllUser" component={ViewAllUser} />
          <Route path="/Admin/ViewAllBooking" component={ViewAllBooking} />
          <Route path="/Admin/UserFeedback" component={UserFeedback} />
        </div>
      </MuiThemeProvider>
    </div>
  );
};

export default Admin;
