import { call, delay, put, select, takeEvery } from "redux-saga/effects";
import {
  hideNotification,
  showNextNotification,
  showNotification,
} from "../store/actions/notifications";

import { GetNotificationQueueLength } from "../store/selectors/notification";

function* _showNotification(action) {
  const length = yield select(GetNotificationQueueLength);
  if (length === 0) {
    yield delay(3000);
    yield put(hideNotification());
    yield delay(100);
    yield call(checkNotificationQueue);
  }
}

function* checkNotificationQueue() {
  const length = yield select(GetNotificationQueueLength);
  if (length > 0) {
    yield put(showNextNotification());
    yield call(_showNotification);
  }
}

const Notification = [takeEvery(showNotification().type, _showNotification)];

export default Notification;
