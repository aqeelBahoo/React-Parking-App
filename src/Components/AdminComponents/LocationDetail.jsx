import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React, { useEffect, useState } from "react";

const LocationDetail = (props) => {
  const [locationName, setLocationName] = useState("");
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
        var locationId = props.location.state.key;
        const rootRef = firebase.database().ref();
        const speedRef = rootRef.child("Locations/" + locationId);
        speedRef.on("value", (snap) => {
          var values = snap.val();
          setLocationName(values.locationName);
          setSlots(values.slots);
        });
      }
    });
  }, []);

  const checkBooking = (slot) => {
    if (new Date(slot.date).getDate() < new Date().getDate()) {
      return true;
    }
    if (new Date(slot.endTime).getTime() < new Date().getTime()) {
      return true;
    }
    return false;
  };

  return (
    <div>
      <MuiThemeProvider>
        <div>
          <Paper className="location-detail" zDepth={3} rounded={false}>
            {slots.map((slot, index) => (
              <RaisedButton
                label={slot.slotNo}
                key={index}
                primary={!slot.disabled}
                disabled={slot.disabled}
              />
            ))}
          </Paper>
        </div>
      </MuiThemeProvider>
    </div>
  );
};

export default LocationDetail;
