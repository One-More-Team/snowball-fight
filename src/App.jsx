import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';

import {
  GetIsSignInInProgress,
  GetIsSignUpInProgress,
  GetUser,
} from './store/selectors/auth';

import SignIn from './components/auth/sign-in/sign-in';
import SignUp from './components/auth/sign-up/sign-up';

import {
  GetSiteLanguageId,
  GetSiteLanguageMessages,
} from './store/selectors/site-language';

import Snow from './components/snow/snow';
import GameModes from './components/game-modes/game-modes';
import { GetIsSiteinited } from './store/selectors/app';
import Notification from './components/notification/notification';
import './App.scss';
import Dialog from './components/dialog/dialog';
import { GetConnectionStatus } from './store/selectors/websocket';
import { connectionState } from './enums/enums';
import GameWrapper from './components/game-wrapper/game-wrapper';
import {measure} from "./store/actions/performance";

const MeasureTime = 5000;

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(GetUser);
  const siteLanguageId = useSelector(GetSiteLanguageId);
  const siteLanguageMessages = useSelector(GetSiteLanguageMessages);
  const isSiteinited = useSelector(GetIsSiteinited);
  const isSingInInProgress = useSelector(GetIsSignInInProgress);
  const isSingUpInProgress = useSelector(GetIsSignUpInProgress);
  const connectionStatus = useSelector(GetConnectionStatus);

  useEffect(() => {
    let timestamp = 0;
    const dispatchMeasure = () => {
      const elapsedTime = performance.now() - timestamp;
      timestamp = performance.now();

      dispatch(measure(elapsedTime));
    };

    dispatchMeasure();
    const timer = setInterval(dispatchMeasure, MeasureTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <IntlProvider
      locale={siteLanguageId}
      messages={siteLanguageMessages}
      onError={() => {}}
    >
      <div
        className={`AppLoader ${
          isSiteinited && !isSingInInProgress && !isSingUpInProgress && 'Loaded'
        }`}
      >
        <i className="fas fa-cog" />
        {' '}
        loading...
      </div>
      <Notification />
      <Dialog />
      {connectionStatus !== connectionState.CONNECTION_IN_GAME && <Snow />}
      <BrowserRouter basename="">
        {user ? (
          <>
            {connectionStatus === connectionState.CONNECTION_IN_GAME ? (
              <GameWrapper />
            ) : (
              <Switch>
                <Route exact path="/" component={GameModes} />
                <Route exact path="/sign-in" component={GameModes} />
                <Route exact path="/sign-up" component={GameModes} />
              </Switch>
            )}
          </>
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
