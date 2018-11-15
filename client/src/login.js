import React, { Component } from "react";

/* We want to import our 'AuthHelperMethods' component in order to send a login request */
import AuthHelperMethods from "./components/AuthHelperMethods";
import { Link } from "react-router-dom";
import "./login.css";

export class Login extends Component {
  Auth = new AuthHelperMethods();
  /* In order to utilize our authentication methods within the AuthService class, we want to instantiate a new object */

  state = {
    email: "",
    password: ""
  };

  /* Fired off every time the use enters something into the input fields */
  _handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    console.log("Hit the handleform submit button");
    /* Upon clicking the login button, a login method is utilized that 
    will send our entered credentials over to the server for verification. 
    Once verified, it should store the token and send the user to the protected route. */
    this.Auth.login(this.state.email, this.state.password)
      .then(res => {
        if (res === false) {
          return alert("Sorry those credentials don't exist!");
        }
        // WHERE THE BUG IS (NOPE)
        // this.props.history.replace("/home");
        console.log("after replace method");
        // this works but route is not authenticated...
        window.location.href = "http://localhost:3000/";
      })
      // END BUG
      .catch(err => {
        alert(err);
      });
  };

  componentWillMount() {
    if (this.Auth.loggedIn()) {
      this.props.history.replace("/");
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="main-wrapper">
          <div className="box">
            <div className="box-header">
              <h1>Login</h1>
            </div>
            <form className="box-form">
              <input
                className="form-item"
                placeholder="Email"
                name="email"
                type="text"
                onChange={this._handleChange}
              />
              <input
                className="form-item"
                placeholder="Password"
                name="password"
                type="password"
                onChange={this._handleChange}
              />
              <button className="form-submit" onClick={this.handleFormSubmit}>
                Login
              </button>
            </form>
            <Link className="link" to="/signup">
              Don't have an account? <span className="link-signup">Signup</span>
            </Link>
          </div>
          <div className="signiture">
            <h1>Designed by Tarek El-Hajjaoui</h1>
            <footer>© Copyright 2018 Tarek El-Hajjaoui</footer>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
