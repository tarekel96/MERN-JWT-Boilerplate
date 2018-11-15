// Small browser library that helps decoding JWTs token which are Base64Url encoded.
const decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

export default class AuthHelperMethods {
  // Initializing important variables
  constructor(domain) {
    //THIS LINE IS ONLY USED WHEN YOU'RE IN PRODUCTION MODE!
    this.domain = domain || "http://localhost:3001"; // API server domain
  }
  login = (email, password) => {
    console.log("inside the AuthHelperMethods.js login");
    // Get a token from api server using the fetch method defined below
    return this.fetch("http://localhost:3001/user/login", {
      method: "POST",
      // convert user info to JSON format and store it in the body of the response
      body: JSON.stringify({
        email,
        password
      })
    }).then(res => {
      console.log("token response");
      // Setting the token in localStorage - setToken defined below
      this.setToken(res.token);
      // finishing up the response?? - wait for the token to come back and then can set token to finish
      return Promise.resolve(res);
    });
  };
  // END BUG (OLD)

  loggedIn = () => {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // Getting token from localstorage
    return !!token && !this.isTokenExpired(token); // handwaiving here - has to have token and cannot be expired
  };
  // THIS TEST FAILED FOR SOME REASON
  isTokenExpired = token => {
    try {
      // const decoded = decode(token);
      console.log(token);
      const decoded = jwt.decode(token);
      console.log(decoded);
      if (decoded.exp < Date.now() / 1000) {
        // Checking if token is expired.
        return true;
      } else return false;
    } catch (err) {
      // console.log(decode(token));
      console.log("expired check failed! Line 42: AuthService.js");
      return false;
    }
  };

  setToken = idToken => {
    // Saves user token to localStorage
    console.log(idToken);
    localStorage.setItem("id_token", idToken);
  };

  getToken = () => {
    // Retrieves the user token from localStorage
    console.log(localStorage.getItem("id_token"));
    return localStorage.getItem("id_token");
  };

  logout = () => {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
  };

  getConfirm = () => {
    // Using jwt-decode npm package to decode the token
    let answer = decode(this.getToken());
    // BREAKS CODE IF I UNCOMMENT
    // console.log(answer);
    console.log("Recieved answer!");
    return answer;
  };

  fetch = (url, options) => {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + this.getToken();
    }

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json());
  };

  _checkStatus = response => {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      // Success status lies between 200 to 300
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };
}
