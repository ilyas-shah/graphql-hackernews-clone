import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { AUTH_TOKEN, USERNAME } from "../constants";

class Header extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const username = localStorage.getItem(USERNAME);
    console.log(username);
    return (
      <div className="flex pa1 justify-between nowrap orange">
        <div className="flex flex-fixed black">
          <div className="fw7 mr1">Hacker News</div>
          <Link to="/" className="ml1 no-underline black">
            new
          </Link>
          {authToken && (
            <div className="flex">
              <div className="ml1">|</div>
              <Link to="/create" className="ml1 no-underline black">
                submit
              </Link>
            </div>
          )}
        </div>
        <div className="flex flex-fixed">
          {authToken ? (
            <div
              className="ml1 pointer black"
              onClick={() => {
                localStorage.removeItem(AUTH_TOKEN);
                localStorage.removeItem(USERNAME);
                this.props.history.push(`/`);
              }}
            >
              <Link
                className="ml1 pointer black"
                to="/user"
                style={{ textDecoration: "none" }}
              >
                {username + " "}
              </Link>
              | logout
            </div>
          ) : (
            <Link to="/login" className="ml1 no-underline black">
              {username ? username : "login"}
            </Link>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
