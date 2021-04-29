import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import firebase from "firebase/app";
import "firebase/auth";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import { Link } from "react-router-dom";

export default class ParkingLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      isReqPending: false,
      isMounted: true,
    };
  }

  componentWillUnmount() {
    this.setState(() => ({ isMounted: false }));
  }

  componentDidMount() {
    this.setState(() => ({ isReqPending: true }));

    const rootRef = firebase.database().ref();
    const speedRef = rootRef.child("Locations/");
    speedRef.on("value", (snap) => {
      var values = snap.val();
      if (values && this.state.isMounted) {
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
  render() {
    return (
      <div>
        <h3>Available Parking Areas</h3>

        <MuiThemeProvider>
          <div>
            <div className={!this.state.isReqPending ? "hidden" : undefined}>
              Locations Loading...
            </div>
            <div className={this.state.isReqPending ? "hidden" : undefined}>
              {this.state.locations.map((location, index) => (
                <div key={index}>
                  <Paper
                    key={index}
                    className="location"
                    zDepth={3}
                    rounded={false}
                  >
                    <h3>{location.locationName}</h3>
                    <Link
                      to={{
                        pathname: "/User/LocationDetail",
                        state: { key: location.id },
                      }}
                    >
                      <RaisedButton label="View Slots" primary={true} />
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
