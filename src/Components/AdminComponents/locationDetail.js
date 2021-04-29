import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";

export default class LocationDetail extends Component {
  constructor() {
    super();
    this.state = {
      locationName: "",
      slots: [],
    };
  }

  checkBooking(slot) {
    if (new Date(slot.date).getDate() < new Date().getDate()) {
      return true;
    }
    if (new Date(slot.endTime).getTime() < new Date().getTime()) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
        var locationId = this.props.location.state.key;
        const rootRef = firebase.database().ref();
        const speedRef = rootRef.child("Locations/" + locationId);
        speedRef.on("value", (snap) => {
          var values = snap.val();
          this.setState({
            locationName: values.locationName,
            slots: values.slots,
          });
        });
      }
    });
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <Paper className="location-detail" zDepth={3} rounded={false}>
              {this.state.slots.map((slot, index) => (
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
  }
}
