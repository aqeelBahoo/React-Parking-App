import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";
import "../../App.css";

export default class ViewAllBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      isReqPending: false,
    };
  }
  componentDidMount() {
    this.setState({
      isReqPending: true,
    });
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
        firebase
          .database()
          .ref("Bookings/")
          .on("value", (snap) => {
            var record = snap.val();
            if (!record) {
              this.setState({
                isReqPending: false,
              });
              return;
            }
            var keys = Object.keys(record);

            const d = keys.map((b) => {
              return {
                date: new Date(record[b].date).toLocaleDateString(),
                endTime: new Date(record[b].endTime).toLocaleString(),
                startTime: new Date(record[b].startTime).toLocaleString(),
                slotNo: record[b].slotNo,
                LocationId: record[b].locationId,
                locationName: record[b].locationName,
              };
            });

            this.setState({
              bookings: d,
              isReqPending: false,
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
            <h3>All Bookings</h3>
            <div className={!this.state.isReqPending ? "hidden" : undefined}>
              All Bookings Loading...
            </div>
            <div className={this.state.isReqPending ? "hidden" : undefined}>
              {this.state.bookings.map((booking, index) => (
                <div key={index}>
                  <Paper
                    key={index}
                    className="location"
                    zDepth={4}
                    rounded={false}
                  >
                    <p> Date : {booking.date}</p>
                    <p>Start Time: {booking.startTime}</p>
                    <p> End Time : {booking.endTime} </p>
                    <p>Slot No. :{booking.slotNo} </p>
                    <p>Location Name:{booking.locationName}</p>
                  </Paper>
                </div>
              ))}
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
