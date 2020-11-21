import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware } from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import { createStore, compose, combineReducers, applyMiddleware } from "redux";
import authReducer from "./store/reducers/auth";
import siteLanguageReducer from "./store/reducers/site-language";
import IndexSaga from "./saga/index";
import websocketReducer from "./store/reducers/websocket";
import appReducer from "./store/reducers/app";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
  authReducer,
  siteLanguageReducer,
  websocketReducer,
  appReducer,
});

export const history = createHistory();
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(sagaMiddleware),
    applyMiddleware(routerMiddleware(history))
  )
);

sagaMiddleware.run(IndexSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
