import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React, { useEffect, useState } from "react";
import "../../App.css";

const ViewAllUser = (props) => {
  const [isReqPending, setReqPending] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setReqPending(true);
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
        const rootRef = firebase.database().ref();
        const speedRef = rootRef.child("Users/");
        speedRef.on("value", (snap) => {
          let users = snap.val();
          if (!users) {
            setReqPending(false);

            return;
          }
          users = Object.keys(users)
            .map((u) => users[u])
            .filter((u) => !u.admin);

          setUsers(users);
          setReqPending(false);
        });
      }
    });
  }, []);

  return (
    <div>
      <h3>All Users</h3>
      <MuiThemeProvider>
        <div>
          <div className={!isReqPending ? "hidden" : undefined}>
            All Users Loading...
          </div>
          <div className={isReqPending ? "hidden" : undefined}>
            {users.map((item, index) => (
              <div key={index}>
                <Paper
                  key={index}
                  className="location"
                  zDepth={3}
                  rounded={false}
                >
                  <p>
                    Name : {item.name}
                    <br />
                  </p>
                  <p>
                    Email: {item.email}
                    <br />
                  </p>
                </Paper>
              </div>
            ))}
          </div>
        </div>
      </MuiThemeProvider>
    </div>
  );
};

export default ViewAllUser;
