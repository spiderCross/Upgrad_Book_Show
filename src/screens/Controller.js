import React, { Fragment, useState } from "react";
import Home from "../screens/home/Home";
import Details from "../screens/details/Details";
import { BrowserRouter as Router, Route } from "react-router-dom";
import BookShow from "../screens/bookshow/BookShow";
import Confirmation from "../screens/confirmation/Confirmation";
import Header from "../common/header/Header";

const Controller = () => {
  const [isLogin, setIsLogin] = useState(false);
  const baseUrl = "/api/v1/";

  return (
    <Fragment>
      <Router>
        <div className="main-container">
          <Route
            exact
            path="/"
            render={(props) => (
              <React.Fragment>
                <Header
                  baseUrl={baseUrl}
                  isLogin={isLogin}
                  setIsLogin={setIsLogin}
                />
                <Home {...props} baseUrl={baseUrl} />
              </React.Fragment>
            )}
          />
          <Route
            path="/movie/:id"
            render={(props) => (
              <React.Fragment>
                <Header
                  baseUrl={baseUrl}
                  isLogin={isLogin}
                  isShowBook={true}
                  setIsLogin={setIsLogin}
                />
                <Details {...props} baseUrl={baseUrl} />
              </React.Fragment>
            )}
          />
          <Route
            path="/bookshow/:id"
            render={(props) => (
              <React.Fragment>
                <Header baseUrl={baseUrl} />
                <BookShow
                  {...props}
                  baseUrl={baseUrl}
                  isLogin={isLogin}
                  setIsLogin={setIsLogin}
                />
              </React.Fragment>
            )}
          />
          <Route
            path="/confirm/:id"
            render={(props) => (
              <React.Fragment>
                <Header baseUrl={baseUrl} />
                <Confirmation
                  {...props}
                  baseUrl={baseUrl}
                  isLogin={isLogin}
                  setIsLogin={setIsLogin}
                />
              </React.Fragment>
            )}
          />
        </div>
      </Router>
    </Fragment>
  );
};

export default Controller;
