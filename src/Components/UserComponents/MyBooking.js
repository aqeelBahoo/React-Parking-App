import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";

export default class MyBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      isReqPending: false,
      isCancelBookReqPending: false,
      isMounted: true,
    };
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  componentDidMount() {
    this.setState({
      isReqPending: true,
    });
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
        var userId = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref("Bookings/")
          .orderByChild("userId")
          .equalTo(userId)
          .on("value", (snap) => {
            var value = snap.val();
            if (this.state.isMounted) {
              const bookings = Object.keys(value || {}).map((key) => {
                let booking = value[key];
                return {
                  locationName: booking.locationName,
                  startTime: new Date(booking.startTime).toLocaleString(),
                  endTime: new Date(booking.endTime).toLocaleString(),
                  slotNo: booking.slotNo,
                  userId: booking.userId,
                  locationId: booking.locationId,
                  date: new Date(booking.date).toLocaleDateString(),
                  id: key,
                };
              });
              this.setState({
                bookings,
                isReqPending: false,
              });
            } else {
              this.setState({
                isReqPending: false,
              });
            }
          });
      }
    });
  }

  cancelSlot(booking) {
    this.setState({ isCancelBookReqPending: true });
    firebase
      .database()
      .ref("Bookings/" + booking.id)
      .remove();

    var location = firebase.database().ref("Locations/" + booking.locationId);
    location.on("value", (snap) => {
      var value = snap.val();
      if (value && this.state.isMounted) {
        const slots = value.slots;
        slots.forEach((slot) => {
          if (slot.slotNo === booking.slotNo) {
            delete slot.date;
            delete slot.startTime;
            delete slot.endTime;
            slot.disabled = false;
          }
        });
        location.update({ slots: slots });
        this.setState({ isCancelBookReqPending: false });
      }
    });
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <h3>My Booking</h3>
            <div className={!this.state.isReqPending ? "hidden" : undefined}>
              Bookings Loading...
            </div>
            <div className={this.state.isReqPending ? "hidden" : undefined}>
              {this.state.bookings.map((booking, index) => (
                <div key={index}>
                  <Paper key={index} style={style} zDepth={4} rounded={false}>
                    <p> Date : {booking.date}</p>
                    <p>Start Time: {booking.startTime}</p>
                    <p> End Time : {booking.endTime} </p>
                    <p>Slot No. :{booking.slotNo} </p>
                    <p>Location Name:{booking.locationName}</p>

                    <RaisedButton
                      label="Cancel Booking"
                      primary={true}
                      disabled={this.state.isCancelBookReqPending}
                      onClick={this.cancelSlot.bind(this, booking)}
                    />
                    <br />
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
const style = {
  width: 1000,
  margin: 5,
  display: "inline-block",
};
