import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React, { useEffect, useState } from "react";

const MyBookings = (props) => {
  const [isReqPending, setReqPending] = useState(false);
  const [isCancelBookReqPending, setBookReqPending] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setReqPending(true);
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
            if (value) {
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
              setBookings(bookings);
              setReqPending(false);
            } else {
              setReqPending(false);
            }
          });
      }
    });
  }, []);

  const cancelSlot = (booking) => {
    setBookReqPending(true);
    firebase
      .database()
      .ref("Bookings/" + booking.id)
      .remove();

    var location = firebase.database().ref("Locations/" + booking.locationId);
    location.on("value", (snap) => {
      var value = snap.val();
      if (value) {
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
        setBookReqPending(false);
      }
    });
  };

  return (
    <div>
      <MuiThemeProvider>
        <div>
          <h3>My Booking</h3>
          <div className={!isReqPending ? "hidden" : undefined}>
            Bookings Loading...
          </div>
          <div className={isReqPending ? "hidden" : undefined}>
            {bookings.map((booking, index) => (
              <div key={index}>
                <Paper key={index} style={style} zDepth={4} rounded={false}>
                  <p>Date : {booking.date}</p>
                  <p>Start Time: {booking.startTime}</p>
                  <p>End Time : {booking.endTime} </p>
                  <p>Slot No. :{booking.slotNo} </p>
                  <p>Location Name:{booking.locationName}</p>

                  <RaisedButton
                    label="Cancel Booking"
                    primary={true}
                    disabled={isCancelBookReqPending}
                    onClick={() => cancelSlot(booking)}
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
};

export default MyBookings;

const style = {
  width: 1000,
  margin: 5,
  display: "inline-block",
};
