import Alert from "@material-ui/lab/Alert";
import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import React, { useState } from "react";

const AddParkingLocation = (props) => {
  const [isReqPending, setReqPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [noOfSlots, setNoOfSlots] = useState(0);
  const [locationName, setLocationName] = useState("");

  const AddNewLocation = () => {
    if (isReqPending || !locationName || !noOfSlots) {
      return false;
    }
    setReqPending(true);
    var slots = [];
    for (let i = 0; i < noOfSlots; i++) {
      slots.push({
        slotNo: "Slot " + Number(i + 1),
      });
    }

    firebase.database().ref("Locations/").push({
      locationName: locationName,
      slots: slots,
    });

    setNoOfSlots(0);
    setLocationName("");
    setReqPending(false);
    setSuccess(true);
  };

  return (
    <div>
      <MuiThemeProvider>
        <div>
          <Paper className="add-location" zDepth={3} rounded={false}>
            <h4> Add New Location</h4>
            <TextField
              hintText="Location Name"
              floatingLabelText="Location"
              value={locationName}
              onChange={(event) => setLocationName(event.target.value)}
            />
            <TextField
              hintText="Number of Slots"
              floatingLabelText="Slots"
              value={noOfSlots}
              type="number"
              onChange={(event) => setNoOfSlots(event.target.value)}
            />

            <br />
            <RaisedButton
              label="Add"
              disabled={isReqPending}
              primary={true}
              onClick={() => AddNewLocation()}
            />
            <div className={!success ? "hidden" : undefined}>
              <Alert severity="success">
                Parking Location Created Successfully.
              </Alert>
            </div>
          </Paper>
        </div>
      </MuiThemeProvider>
    </div>
  );
};

export default AddParkingLocation;
