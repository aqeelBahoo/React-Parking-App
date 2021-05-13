import firebase from "firebase/app";
import "firebase/auth";
import AppBar from "material-ui/AppBar";
import Drawer from "material-ui/Drawer";
import FlatButton from "material-ui/FlatButton";
import MenuItem from "material-ui/MenuItem";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import LocationDetail from "./LocationDetail";
import MyBookings from "./MyBookings";
import MyFeedbacks from "./MyFeedBacks";
import ParkingLocations from "./ParkingLocations";
import SendFeedBack from "./SendFeedBack";

const User = (props) => {
  const [opened, setOpen] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
      } else {
        props.history.push("/");
      }
    });
  }, []);

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {});
    props.history.push("/");
  };

  const goto = (endpoint) => {
    props.history.push(`/User/${endpoint}`);
  };

  return (
    <div>
      <MuiThemeProvider>
        <div>
          <AppBar
            title={<span style={styles.title}>Welcome User</span>}
            onClick={() => setOpen(!opened)}
            iconElementRight={<FlatButton label="Log out" onClick={logout} />}
          />
          <div>
            <Drawer open={opened}>
              <MenuItem onClick={() => setOpen(!opened)}> X </MenuItem>

              <MenuItem onClick={() => goto("ParkingLocation")}>
                Parking Locations
              </MenuItem>
              <MenuItem onClick={() => goto("MyBooking")}>My Booking</MenuItem>
              <MenuItem onClick={() => goto("MyFeedBack")}>
                My Feedback
              </MenuItem>
              <MenuItem onClick={() => goto("SendFeedBack")}>
                Send Feedback
              </MenuItem>
            </Drawer>
          </div>
          <Route path="/User/ParkingLocation" component={ParkingLocations} />
          <Route path="/User/MyBooking" component={MyBookings} />
          <Route path="/User/SendFeedBack" component={SendFeedBack} />
          <Route path="/User/MyFeedBack" component={MyFeedbacks} />
          <Route path="/User/LocationDetail" component={LocationDetail} />
        </div>
      </MuiThemeProvider>
    </div>
  );
};

export default User;
const styles = {
  title: {
    cursor: "pointer",
  },
};
