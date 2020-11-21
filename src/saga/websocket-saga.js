import { eventChannel } from "redux-saga";
import {
  call,
  put,
  take,
  delay,
  takeEvery,
  fork,
  select,
} from "redux-saga/effects";
import { ServerMessages } from "../enums/enums";
import { INIT_CONNECTION } from "../store/actions/common";
import {
  storeSDPAnswer,
  storeSDPOffer,
  storeUserID,
} from "../store/actions/user";
import { storePlayers, updateGameMode } from "../store/actions/websocket";

import {
  CONNECTED_TO_WS,
  connectedToWS,
  updatePlayerNumbers,
} from "../store/actions/websocket";
import { GetGameMode } from "../store/selectors/websocket";
import { info } from "../utils/logger";

const INIT = "init";
const JOIN = "join";
const LEAVE = "leave";
const UPDATEPOSITION = "updatePosition";

const wsUri = "wss://192.168.2.109:8081";
let websocket;

function* connectAndStart({ gameMode }) {
  yield delay(500);
  info("New game selected:", gameMode);

  const prevGameMode = yield select(GetGameMode);
  info("Previous Game:", prevGameMode);
  if (prevGameMode != "" && prevGameMode != gameMode) {
    info("Game change detected -> Closing WSS");
    yield call(closeWebSocket);
  }

  yield fork(createWebSocket);
  yield take(CONNECTED_TO_WS);
  yield put(updateGameMode(gameMode));
  yield call(doSend, {
    header: "start",
    data: { gameMode: gameMode.toLowerCase() },
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
        case ServerMessages.READY: {
          emit(storeUserID(rawData.data.id));
          emit(storePlayers(rawData.data.players));
          break;
        }
        case ServerMessages.SEND_WEBRTC_ANSWER: {
          emit(storeSDPAnswer(rawData));
          break;
        }
        case ServerMessages.SEND_WEBRTC_OFFER: {
          emit(storeSDPOffer(rawData));
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

function closeWebSocket() {
  websocket.close();
}

export function doSend(msgObj) {
  websocket.send(JSON.stringify(msgObj));
}

const WebSocketSaga = [
  takeEvery(INIT_CONNECTION, connectAndStart),
  //takeEvery(CONNECTED_TO_WS, showLobby),
];

export default WebSocketSaga;
