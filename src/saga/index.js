import { all, call, put } from "redux-saga/effects";

import { initApp } from "../store/actions/common";
import Auth from "./auth";
import User from "./user";
import WebSocketSaga from "./websocket-saga";
import WebRTCSaga from "./webrtc-saga";
import Notification from "./notification";

function* initialCall() {
  yield put(initApp());
}

function* Index() {
  yield all([
    ...Auth,
    ...User,
    ...WebSocketSaga,
    ...WebRTCSaga,
    ...Notification,
  ]);
  yield call(initialCall);
}

export default Index;
