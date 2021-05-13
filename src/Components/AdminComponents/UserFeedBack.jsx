import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React, { useEffect, useState } from "react";
import "../../App.css";

const UserFeedback = (props) => {
  const [isReqPending, setReqPending] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    setReqPending(true);
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
        firebase
          .database()
          .ref("Feedbacks/")
          .on("value", (snap) => {
            var userobj = snap.val();
            if (!userobj) {
              setReqPending(false);
              return;
            }
            var keys = Object.keys(userobj);
            const feedbacks = keys.map((f, i) => {
              return {
                id: f,
                feedback: userobj[f].FeedBack,
              };
            });
            setFeedbacks(feedbacks);
            setReqPending(false);
          });
      }
    });
  }, []);

  const deleteFeedback = (id) => {
    firebase
      .database()
      .ref("Feedbacks/" + id)
      .remove();
  };

  return (
    <div>
      <MuiThemeProvider>
        <div>
          <h3>User Feedback</h3>
          <div className={!isReqPending ? "hidden" : undefined}>
            Feedbacks Loading...
          </div>
          <div className={isReqPending ? "hidden" : undefined}>
            {feedbacks.map((item, index) => (
              <div key={index}>
                <Paper
                  key={index}
                  className="location"
                  zDepth={4}
                  rounded={false}
                >
                  <p> FeedBack : {item.feedback}</p>

                  <RaisedButton
                    label="Delete"
                    primary={true}
                    onClick={() => deleteFeedback(item.id)}
                  />
                </Paper>
              </div>
            ))}
          </div>
        </div>
      </MuiThemeProvider>
    </div>
  );
};

export default UserFeedback;
