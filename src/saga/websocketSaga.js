import { eventChannel } from "redux-saga";
import {
  call,
  put,
  take,
  select,
  takeLatest,
  delay,
  takeEvery,
  fork,
} from "redux-saga/effects";
import { ServerMessages } from "../enums/enums";
import { changeRoute, INIT_CONNECTION } from "../store/actions/common";

import {
  CONNECTED_TO_WS,
  saveId,
  connectedToWS,
  saveProducts,
  updatePlayerNumbers,
} from "../store/actions/websocket";
import { GetDisplayName, GetMyId } from "../store/selectors/websocket";
import { info } from "../utils/logger";
import { push } from "react-router-redux";

const INIT = "init";
const JOIN = "join";
const LEAVE = "leave";
const UPDATEPOSITION = "updatePosition";

const wsUri = "wss://192.168.2.109:8081";
let websocket;

function* connectAndStart({ payload }) {
  yield delay(500);
  info("Game selected:", payload);
  yield fork(createWebSocket);
  yield take(CONNECTED_TO_WS);
  yield call(doSend, {
    header: "start",
    data: { gameMode: payload.toLowerCase() },
  });
}

function* createWebSocket() {
  websocket = new WebSocket(wsUri);
  websocket.onclose = (evt) => onClose(evt);
  websocket.onerror = (evt) => onError(evt);

  const channel = yield call(subscribe, websocket);
  while (true) {
    let action = yield take(channel);

    yield put(action);
  }
}

function subscribe(socket) {
  return new eventChannel((emit) => {
    socket.onopen = (evt) => {
      info("WS CONNECTED");
      emit(connectedToWS());
    };

    socket.onmessage = (evt) => {
      let rawData = JSON.parse(evt.data);
      let command = rawData.header;

      switch (command) {
        case ServerMessages.PLAYERNUM: {
          info(
            "Player Number Updated ",
            rawData.data.playerNum,
            rawData.data.expectedPlayerNum
          );
          emit(updatePlayerNumbers(rawData.data));
          break;
        }
        case INIT: {
          emit(saveId(rawData.data.id));
          emit(saveProducts(rawData.data.shops));
          window.setShops(rawData.data.shops);
          break;
        }
        case JOIN: {
          break;
        }
        case LEAVE: {
          break;
        }
        case UPDATEPOSITION: {
          break;
        }
        default: {
        }
      }
    };

    return () => {};
  });
}

function writeToScreen(message) {
  console.log(`${message}`);
}

function onClose(evt) {
  writeToScreen("DISCONNECTED");
}

function onError(evt) {
  writeToScreen(`ERROR: ${evt.data}`);
}

function doSend(msgObj) {
  websocket.send(JSON.stringify(msgObj));
}

function* showLobby() {
  yield delay(500);
  info("CHANGING ROUTE TO LOBBY");
  yield put(push("/lobby"));
}

const WebSocketSaga = [
  takeEvery(INIT_CONNECTION, connectAndStart),
  takeEvery(CONNECTED_TO_WS, showLobby),
];

export default WebSocketSaga;
