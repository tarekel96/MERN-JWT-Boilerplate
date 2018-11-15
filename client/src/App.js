import React, { Component } from "react";
import "./App.css";
// Authservice' and 'withAuth' componenets are imported to use their methods
import AuthHelperMethods from "./components/AuthHelperMethods";
// Our higher order - ensures that the component is authenticated
import withAuth from "./components/withAuth";

class App extends Component {
  // state = {
  //   username: "",
  //   password: ""
  // };

  // Create a new instance of the 'AuthHelperMethods' component
  Auth = new AuthHelperMethods();

  // Method to log the user out upon clicking 'Logout'
  _handleLogout = () => {
    this.Auth.logout();
    this.props.history.replace("/login");
  };

  // Render the protected component
  render() {
    // eslint-disable-next-line
    let email = this.props.confirm.email;

    return (
      <div className="App">
        <div className="main-page">
          <div className="top-section">
            <h1>Welcome, {email}. You are now Authenticated!</h1>
          </div>
          <div className="bottom-section">
            <button onClick={this._handleLogout}>LOGOUT</button>
          </div>
          <div className="signiture">
            <h1>Designed by Tarek El-Hajjaoui</h1>
            <footer>© Copyright 2018 Tarek El-Hajjaoui</footer>
          </div>
        </div>
      </div>
    );
  }
}

//In order for this component to be protected, we must wrap it with what we call a 'Higher Order Component' or HOC.
// higher order - comes first
export default withAuth(App);
