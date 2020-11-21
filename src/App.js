import React from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router";
import { IntlProvider } from "react-intl";
import {
  GetIsSignInInProgress,
  GetIsSignUpInProgress,
  GetUser,
} from "./store/selectors/auth";
import { BrowserRouter } from "react-router-dom";

import SignIn from "./components/auth/sign-in/sign-in";
import SignUp from "./components/auth/sign-up/sign-up";

import {
  GetSiteLanguageId,
  GetSiteLanguageMessages,
} from "./store/selectors/site-language";
import Snow from "./components/snow/snow";
import GameModes from "./components/game-modes/game-modes";
import { GetIsSiteinited } from "./store/selectors/app";
import Lobby from "./components/lobby/lobby";
import Notification from "./components/notification/notification";

import "./App.scss";
import Dialog from "./components/dialog/dialog";

const App = () => {
  const user = useSelector(GetUser);
  const siteLanguageId = useSelector(GetSiteLanguageId);
  const siteLanguageMessages = useSelector(GetSiteLanguageMessages);
  const isSiteinited = useSelector(GetIsSiteinited);
  const isSingInInProgress = useSelector(GetIsSignInInProgress);
  const isSingUpInProgress = useSelector(GetIsSignUpInProgress);

  /* setTimeout(() => {
    window.createWorld({
      serverCall: () => console.log,
      userName: "Krisz",
      onReady: () => {},
    });
  }, 1000); */

  /* return (
    <div>
      <canvas
        id="canvas"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          left: 0,
          top: 0,
        }}
      />
      <GameUi />
    </div>
  ); */

  return (
    <IntlProvider
      locale={siteLanguageId}
      messages={siteLanguageMessages}
      onError={() => {}}
    >
      <div
        className={`AppLoader ${
          isSiteinited && !isSingInInProgress && !isSingUpInProgress && "Loaded"
        }`}
      >
        <i className="fas fa-cog"></i> loading...
      </div>
      <Notification />
      <Dialog />
      <Snow />
      <BrowserRouter basename="">
        {user ? (
          <Switch>
            <Route exact path="/" component={GameModes} />
            <Route exact path="/sign-in" component={GameModes} />
            <Route exact path="/sign-up" component={GameModes} />
            <Route exact path="/lobby" component={Lobby} />
          </Switch>
        ) : (
          <Switch>
            <Route exact path="/" component={SignIn} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/sign-up" component={SignUp} />
          </Switch>
        )}
      </BrowserRouter>
    </IntlProvider>
  );
};

export default App;
