import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import "../../App.css";
import { Link } from "react-router-dom";

export default class ParkingLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      isReqPending: false,
    };
  }

  componentDidMount() {
    this.setState({ isReqPending: true });
    firebase.auth().onAuthStateChanged(() => {
      if (firebase.auth().currentUser) {
        const rootRef = firebase.database().ref();
        const speedRef = rootRef.child("Locations/");
        speedRef.on("value", (snap) => {
          var values = snap.val();
          if (values) {
            var keys = Object.keys(values);
            const locations = keys.map((l) => {
              return {
                locationName: values[l].locationName,
                id: l,
              };
            });
            this.setState({ locations, isReqPending: false });
          } else {
            this.setState({ isReqPending: false });
          }
        });
      }
    });
  }

  render() {
    return (
      <div>
        <h3>All Parking Areas</h3>
        <MuiThemeProvider>
          <div>
            <div className={!this.state.isReqPending ? "hidden" : undefined}>
              Locations Loading...
            </div>
            <div className={this.state.isReqPending ? "hidden" : undefined}>
              {this.state.locations.map((item, index) => (
                <div key={index}>
                  <Paper
                    key={index}
                    className="location"
                    zDepth={3}
                    rounded={false}
                  >
                    <h3>{item.locationName}</h3>
                    <Link
                      to={{
                        pathname: "/Admin/LocationDetail",
                        state: { key: item.id },
                      }}
                    >
                      <RaisedButton label="View Slot" primary={true} />
                    </Link>
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
