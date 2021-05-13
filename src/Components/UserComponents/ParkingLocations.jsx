import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ParkingLocations = (props) => {
  const [isReqPending, setReqPending] = useState(false);
  const [locations, setLocations] = useState(false);

  useEffect(() => {
    setReqPending(true);
    const rootRef = firebase.database().ref();
    const speedRef = rootRef.child("Locations/");
    speedRef.on("value", (snap) => {
      var values = snap.val();
      if (values) {
        var keys = Object.keys(values);
        const locations = keys.map((l) => {
          return {
            locationName: values[l].locationName,
            id: l,
          };
        });
        setLocations(locations);
        setReqPending(false);
      } else {
        setReqPending(false);
      }
    });
  }, []);

  return (
    <div>
      <h3>Available Parking Areas</h3>

      <MuiThemeProvider>
        <div>
          <div className={!isReqPending ? "hidden" : undefined}>
            Locations Loading...
          </div>
          <div className={isReqPending ? "hidden" : undefined}>
            {locations.map((location, index) => (
              <div key={index}>
                <Paper
                  key={index}
                  className="location"
                  zDepth={3}
                  rounded={false}
                >
                  <h3>{location.locationName}</h3>
                  <Link
                    to={{
                      pathname: "/User/LocationDetail",
                      state: { key: location.id },
                    }}
                  >
                    <RaisedButton label="View Slots" primary={true} />
                  </Link>
                </Paper>
              </div>
            ))}
          </div>
        </div>
      </MuiThemeProvider>
    </div>
  );
};

export default ParkingLocations;
