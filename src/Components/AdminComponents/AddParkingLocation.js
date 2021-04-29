import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";
import Alert from "@material-ui/lab/Alert";

export default class AddParkingLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noOfSlots: "",
      locationName: "",
      isReqPending: false,
      success: false,
    };
  }
  AddNewLocation() {
    if (
      this.state.isReqPending ||
      !this.state.locationName ||
      !this.state.noOfSlots
    ) {
      return false;
    }
    this.setState({ isReqPending: true });
    var slots = [];
    for (let i = 0; i < this.state.noOfSlots; i++) {
      slots.push({
        slotNo: "Slot " + Number(i + 1),
      });
    }

    firebase.database().ref("Locations/").push({
      locationName: this.state.locationName,
      slots: slots,
    });
    this.setState({
      noOfSlots: "",
      locationName: "",
      isReqPending: false,
      success: true,
    });
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <Paper className="add-location" zDepth={3} rounded={false}>
              <h4> Add New Location</h4>
              <TextField
                hintText="Location Name"
                floatingLabelText="Location"
                value={this.state.locationName}
                onChange={(event) =>
                  this.setState({ locationName: event.target.value })
                }
              />
              <TextField
                hintText="Number of Slots"
                floatingLabelText="Slots"
                value={this.state.noOfSlots}
                type="number"
                onChange={(event) =>
                  this.setState({ noOfSlots: event.target.value })
                }
              />

              <br />
              <RaisedButton
                label="Add"
                disabled={this.state.isReqPending}
                primary={true}
                onClick={(event) => this.AddNewLocation()}
              />
              <div className={!this.state.success ? "hidden" : undefined}>
                <Alert severity="success">
                  Parking Location Created Successfully.
                </Alert>
              </div>
            </Paper>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
