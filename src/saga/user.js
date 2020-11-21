import firebase from "firebase/app";
import { eventChannel } from "redux-saga";
import { put, takeEvery, takeLatest } from "redux-saga/effects";

import { USERS } from "../common/database/database";
import { setUser } from "../store/actions/auth";
import { storeUserData } from "../store/actions/user";

function* _setUser(action) {
  const databaseRef = firebase.database().ref(`${USERS}/${action.payload.uid}`);
  const onChangeChannel = eventChannel((emit) => databaseRef.on("value", emit));
  yield takeEvery(onChangeChannel, onChangeHandler);
}

function* onChangeHandler(snap) {
  const userData = snap.val();
  yield put(storeUserData(userData));
}

const User = [takeLatest(setUser().type, _setUser)];

export default User;
