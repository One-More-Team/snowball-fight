import { all, call, put } from "redux-saga/effects";

import { initApp } from "../store/actions/common";
import Auth from "./auth";

function* initialCall() {
  yield put(initApp());
}

function* Index() {
  yield all([...Auth]);
  yield call(initialCall);
}

export default Index;
