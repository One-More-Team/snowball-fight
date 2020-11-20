import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import createSagaMiddleware from "redux-saga";
import { createStore, compose, combineReducers, applyMiddleware } from "redux";
import authReducer from "./store/reducers/auth";
import siteLanguageReducer from "./store/reducers/site-language";
import IndexSaga from "./saga/index";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
  authReducer,
  siteLanguageReducer,
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(IndexSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
