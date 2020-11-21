import { all, call, put } from "redux-saga/effects";

import { initApp } from "../store/actions/common";
import Auth from "./auth";
import User from "./user";
import WebSocketSaga from "./websocket-saga";

function* initialCall() {
  yield put(initApp());
}

function* Index() {
  yield all([...Auth, ...User, ...WebSocketSaga]);
  yield call(initialCall);
}

export default Index;
