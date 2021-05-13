import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React, { useEffect, useState } from "react";

const MyFeedBack = (props) => {
  const [isReqPending, setReqPending] = useState(false);
  const [feedbacks, setFeedbacks] = useState(false);

  useEffect(() => {
    setReqPending(true);
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
        var userId = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref("Feedbacks/")
          .orderByChild("userId")
          .equalTo(userId)
          .on("value", (snap) => {
            var feedbacks = snap.val();
            if (feedbacks) {
              const data = Object.keys(feedbacks).map(
                (f) => feedbacks[f].FeedBack
              );
              setFeedbacks(feedbacks);
              setReqPending(false);
            } else {
              setReqPending(false);
            }
          });
      }
    });
  }, []);

  return (
    <div>
      <MuiThemeProvider>
        <div className="add-location">
          <h3>My Feedbacks</h3>
          <div className={!isReqPending ? "hidden" : undefined}>
            Feedbacks Loading...
          </div>
          <div className={isReqPending ? "hidden" : undefined}>
            {feedbacks.map((feedback, index) => (
              <div key={index}>
                <Paper
                  key={index}
                  className="feedback"
                  zDepth={4}
                  rounded={false}
                >
                  <p> FeedBack : {feedback}</p>
                </Paper>
              </div>
            ))}
          </div>
        </div>
      </MuiThemeProvider>
    </div>
  );
};

export default MyFeedBack;
