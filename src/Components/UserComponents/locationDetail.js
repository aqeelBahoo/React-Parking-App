import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import firebase from "firebase/app";
import "firebase/auth";
import TimePicker from "material-ui/TimePicker";
import { Card, CardText } from "material-ui/Card";
import DatePicker from "material-ui/DatePicker";
import "../../App.css";
import Alert from "@material-ui/lab/Alert";

export default class LocationDetail extends Component {
  constructor() {
    super();
    this.state = {
      locationName: "",
      slots: [],
      locationId: "",
      submitted: false,
      slotNumber: "",
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      isMounted: true,
      firebase: firebase,
    };
  }

  componentWillUnmount() {
    this.setState({ isMounted: false, firebase: undefined });
  }

  componentDidMount() {
    var locationId = this.props.location.state.key;
    const rootRef = this.state.firebase.database().ref();
    const speedRef = rootRef.child("Locations/" + locationId);
    speedRef.on("value", (snap) => {
      var values = snap.val();
      if (values && this.state.isMounted) {
        this.setState({
          locationName: values.locationName,
          slots: values.slots,
          locationId,
        });
      }
    });
  }

  checkBooking() {
    const slots = this.state.slots;
    if (slots.length !== 0) {
      const userStartTime = this.getTimeInMiliSec(
        this.state.startTime,
        this.state.date
      );
      const userEndTime = this.getTimeInMiliSec(
        this.state.endTime,
        this.state.date
      );
      if (userStartTime < new Date().getTime()) {
        this.setState({
          errorMessage: "Please Select Start Time Greater Then Current Time.",
        });
        return;
      } else if (userStartTime > userEndTime) {
        this.setState({
          errorMessage: "Please Select End Time Greater Then Start Time.",
        });
        return;
      }
      this.setState({
        errorMessage: undefined,
      });

      slots.forEach((s) => {
        const bookedStartTime = this.getTimeInMiliSec(s.startTime, s.date);
        const bookedEndTime = this.getTimeInMiliSec(s.endTime, s.date);

        if (
          (bookedStartTime > userStartTime && bookedStartTime > userEndTime) ||
          (bookedStartTime < userStartTime && bookedEndTime < userStartTime)
        ) {
          s.disabled = false;
        } else {
          s.disabled = true;
        }
      });
      this.setState({ slots, submitted: true });
    }
  }

  getTimeInMiliSec(time, date) {
    var t = new Date(time);
    var dateString = new Date(date).toLocaleDateString();
    var timeString = t.getHours() + ":" + t.getMinutes() + ":00";
    return new Date(dateString + " " + timeString).getTime();
  }

  Book(slotNo) {
    const s = this.state;
    if (!s.startTime || !s.endTime || !s.date) {
      return;
    }
    var userId = this.state.firebase.auth().currentUser.uid;
    const bookingRef = this.state.firebase.database().ref("Bookings/");
    if (this.state.isMounted) {
      bookingRef
        .push({
          userId: userId,
          locationId: this.state.locationId,
          slotNo: String(slotNo),
          startTime: String(s.startTime),
          endTime: String(s.endTime),
          date: String(s.date),
          locationName: String(this.state.locationName),
        })
        .then(() => {
          var location = this.state.firebase
            .database()
            .ref("Locations/" + this.state.locationId);
          const slots = this.state.slots;
          slots.forEach((slot) => {
            if (slot.slotNo === slotNo) {
              slot.date = s.date;
              slot.startTime = s.startTime;
              slot.endTime = s.endTime;
              slot.disabled = true;
            }
          });
          if (this.state.isMounted) {
            location.update({ slots: slots });
            alert("Slot has been Booked for you");
            this.setState({ slotNumber: slotNo, submitted: false });
          }
        });
    }
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <h2> Reserved Parking {this.state.slotNumber}</h2>
            <div>
              <TimePicker
                defaultTime={this.state.startTime}
                onChange={(...arg) => {
                  this.setState({ startTime: arg[1], submitted: false });
                }}
                floatingLabelText="Start Time"
                autoOk={true}
              />
            </div>

            <div>
              <TimePicker
                defaultTime={this.state.endTime}
                onChange={(...arg) => {
                  this.setState({ endTime: arg[1], submitted: false });
                }}
                style={{ display: "inline-block" }}
                floatingLabelText="End Time"
                autoOk={true}
              />
            </div>

            <div>
              <DatePicker
                autoOk={true}
                minDate={new Date()}
                defaultDate={this.state.date}
                onChange={(...arg) => {
                  this.setState({ date: arg[1], submitted: false });
                }}
                style={{ display: "inline-block" }}
                floatingLabelText="Select Date"
              />
            </div>

            <div>
              <RaisedButton
                label="Find Slot"
                primary={true}
                onClick={() => {
                  this.checkBooking();
                }}
              />
            </div>

            <div className={!this.state.errorMessage ? "hidden" : undefined}>
              <Alert severity="error">{this.state.errorMessage}</Alert>
            </div>

            <div className={!this.state.submitted ? "hidden" : undefined}>
              <Card expanded={true}>
                <CardText expandable={true}>
                  {this.state.slots.map((slot, index) => (
                    <RaisedButton
                      label={slot.slotNo}
                      key={index}
                      primary={!slot.disabled}
                      disabled={slot.disabled}
                      onClick={() => {
                        this.Book(slot.slotNo);
                      }}
                    />
                  ))}
                </CardText>
              </Card>
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
  display: "inline",
};
