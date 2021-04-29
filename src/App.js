import React, { Component } from "react";
import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import Home from "./Components/Home";
import SignUp from "./Components/signup";
import User from "./Components/UserComponents/user";
import Admin from "./Components/AdminComponents/admin";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(() => {
      this.setState({
        user: firebase.auth().currentUser,
      });
    });
  }
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/" render={(props) => <Home {...props} />} />
            <Route path="/SignUp" component={SignUp} />
            <Route path="/Admin" component={Admin} />
            <Route path="/User" component={User} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
