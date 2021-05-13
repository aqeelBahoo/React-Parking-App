import "firebase/auth";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Admin from "./Components/AdminComponents/Admin";
import Login from "./Components/Login";
import SignUp from "./Components/signup";
import User from "./Components/UserComponents/User";

const App = (props) => {
  return (
    <div className="App">
      <Router>
        <div>
          <Route exact path="/" render={(props) => <Login {...props} />} />
          <Route path="/SignUp" component={SignUp} />
          <Route path="/Admin" component={Admin} />
          <Route path="/User" component={User} />
        </div>
      </Router>
    </div>
  );
};

export default App;
