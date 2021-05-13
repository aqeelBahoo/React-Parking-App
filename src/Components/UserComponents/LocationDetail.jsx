import Alert from "@material-ui/lab/Alert";
import firebase from "firebase/app";
import "firebase/auth";
import { Card, CardText } from "material-ui/Card";
import DatePicker from "material-ui/DatePicker";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TimePicker from "material-ui/TimePicker";
import React, { useEffect, useState } from "react";
import "../../App.css";

const LocationDetail = (props) => {
  const [slots, setSlots] = useState([]);
  const [locationId, setLocationId] = useState("");
  const [locationName, setLocationName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [slotNumber, setSlotNumber] = useState(-1);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    var locationId = props.location.state.key;
    const rootRef = firebase.database().ref();
    const speedRef = rootRef.child("Locations/" + locationId);
    speedRef.on("value", (snap) => {
      var values = snap.val();
      if (values) {
        setLocationName(values.locationName);
        setSlots(values.slots);
        setLocationId(locationId);
      }
    });
    return () => {};
  }, []);

  const checkBooking = () => {
    if (slots.length !== 0) {
      const userStartTime = getTimeInMiliSec(startTime, date);
      const userEndTime = getTimeInMiliSec(endTime, date);
      if (userStartTime < new Date().getTime()) {
        setErrorMessage("Please Select Start Time Greater Then Current Time.");
        return;
      } else if (userStartTime > userEndTime) {
        setErrorMessage("Please Select End Time Greater Then Start Time.");
        return;
      }
      setErrorMessage("");
      slots.forEach((s) => {
        const bookedStartTime = getTimeInMiliSec(s.startTime, s.date);
        const bookedEndTime = getTimeInMiliSec(s.endTime, s.date);

        if (
          (bookedStartTime > userStartTime && bookedStartTime > userEndTime) ||
          (bookedStartTime < userStartTime && bookedEndTime < userStartTime)
        ) {
          s.disabled = false;
        } else {
          s.disabled = true;
        }
      });
      setSlots(slots);
      setSubmitted(true);
    }
  };

  const getTimeInMiliSec = (time, date) => {
    var t = new Date(time);
    var dateString = new Date(date).toLocaleDateString();
    var timeString = t.getHours() + ":" + t.getMinutes() + ":00";
    return new Date(dateString + " " + timeString).getTime();
  };

  const book = (slotNo) => {
    if (!startTime || !endTime || !date) {
      return;
    }
    var userId = firebase.auth().currentUser.uid;
    const bookingRef = firebase.database().ref("Bookings/");
    bookingRef
      .push({
        userId: userId,
        locationId: locationId,
        slotNo: String(slotNo),
        startTime: String(startTime),
        endTime: String(endTime),
        date: String(date),
        locationName: String(locationName),
      })
      .then(() => {
        var location = firebase.database().ref("Locations/" + locationId);
        slots.forEach((slot) => {
          if (slot.slotNo === slotNo) {
            slot.date = date;
            slot.startTime = startTime;
            slot.endTime = endTime;
            slot.disabled = true;
          }
        });
        location.update({ slots: slots });
        alert("Slot has been Booked for you");
        setSlotNumber(slotNo);
        setSubmitted(false);
      });
  };

  return (
    <div>
      <MuiThemeProvider>
        <div>
          <h2> Reserved Parking {slotNumber}</h2>
          <div>
            <TimePicker
              defaultTime={startTime}
              onChange={(...arg) => {
                setStartTime(arg[1]);
                setSubmitted(false);
              }}
              floatingLabelText="Start Time"
              autoOk={true}
            />
          </div>

          <div>
            <TimePicker
              defaultTime={endTime}
              onChange={(...arg) => {
                setEndTime(arg[1]);
                setSubmitted(false);
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
              defaultDate={date}
              onChange={(...arg) => {
                setDate(arg[1]);
                setSubmitted(false);
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
                checkBooking();
              }}
            />
          </div>

          <div className={!errorMessage ? "hidden" : undefined}>
            <Alert severity="error">{errorMessage}</Alert>
          </div>

          <div className={!submitted ? "hidden" : undefined}>
            <Card expanded={true}>
              <CardText expandable={true}>
                {slots.map((slot, index) => (
                  <RaisedButton
                    label={slot.slotNo}
                    key={index}
                    primary={!slot.disabled}
                    disabled={slot.disabled}
                    onClick={() => {
                      book(slot.slotNo);
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
};

export default LocationDetail;
