import React, { Component } from "react";
import Login from "./login";

export default class Home extends Component {
  render() {
    return (
      <div>
        <div>
          <h3>Real-Time Car Parking Booking</h3>
        </div>
        <Login {...this.props} />
      </div>
    );
  }
}
