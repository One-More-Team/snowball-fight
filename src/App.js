import React from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router";
import { IntlProvider } from "react-intl";
import { GetUser } from "./store/selectors/auth";
import { BrowserRouter } from "react-router-dom";
import { useHistory } from "react-router-dom";

import SignIn from "./components/auth/sign-in/sign-in";
import SignUp from "./components/auth/sign-up/sign-up";

import {
  GetSiteLanguageId,
  GetSiteLanguageMessages,
} from "./store/selectors/site-language";
import Button, { ButtonStyle } from "./components/form/button/button";
import Snow from "./components/snow/snow";
import GameModes from "./components/gamemodes/gameModes";
import GameUi from "./game/game-ui";
import { GetCurrentRoute } from "./store/selectors/app";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(GetUser);
  const siteLanguageId = useSelector(GetSiteLanguageId);
  const siteLanguageMessages = useSelector(GetSiteLanguageMessages);
  const history = useHistory();


  setTimeout(() => {
    window.createWorld({
      serverCall: () => console.log,
      userName: "Krisz",
      onReady: () => {},
    });
  }, 1000);

  return (
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
  );

  return (
    <IntlProvider
      locale={siteLanguageId}
      messages={siteLanguageMessages}
      onError={() => {}}
    >
      <Snow />
      <BrowserRouter basename="">
        {true || user ? (
          <Switch>
            <Route exact path="/" component={GameModes} />
            <Route exact path="/lobby" component={SignUp} />
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
