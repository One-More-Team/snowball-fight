import { eventChannel } from "redux-saga";
import { call, put, take, select, takeLatest, delay } from "redux-saga/effects";

import {
  CHAT_MESSAGE_SEND,
  CONNECT_TO_WS,
  CONNECTED_TO_WS_EMULATE,
  saveId,
  saveChatMessage,
  connectedToWS,
  connectedToWSEmulate,
  onSnowBallReady,
  saveProducts,
  saveUsers,
  saveUser,
  clearUser,
  SAVE_USERS,
  CLEAR_USER,
  SAVE_USER,
  updatePositions,
  UPDATE_POSITIONS,
} from "../store/actions/websocket";
import { GetDisplayName, GetMyId } from "../store/selectors/websocket";

const INIT = "init";
const SEND_CHAT_MESSAGE = "sendChatMessage";
const JOIN = "join";
const LEAVE = "leave";
const UPDATEPOSITION = "updatePosition";

// const wsUri = "wss://snow-ball.herokuapp.com";
const wsUri = "ws://echo.websocket.org";
let websocket;

function* createWebSocket(action) {
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
      writeToScreen("CONNECTED");
      emit(connectedToWSEmulate());
    };

    socket.onmessage = (evt) => {
      let rawData = JSON.parse(evt.data);
      let command = rawData.header;

      switch (command) {
        case INIT: {
          emit(saveId(rawData.data.id));
          emit(saveProducts(rawData.data.shops));
          emit(saveUsers(rawData.data.clientList));
          window.setShops(rawData.data.shops);
          break;
        }
        case SEND_CHAT_MESSAGE: {
          emit(saveChatMessage(rawData.data));
          break;
        }
        case JOIN: {
          emit(saveUser(rawData.data));
          break;
        }
        case LEAVE: {
          emit(clearUser(rawData.data));
          break;
        }
        case UPDATEPOSITION: {
          emit(updatePositions(rawData.data));
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

function doSend(message) {
  var json = JSON.parse(message);
  if (!["updatePosition"].find((func) => func === json.header)) {
    writeToScreen(`<-----   ${message}`);
  }

  websocket.send(message);
}

function* emulateConnected() {
  yield delay(2000);
  yield put(connectedToWS());

  const userName = yield select(GetDisplayName);
  localStorage.setItem("lastDisplayName", userName);

  yield call(doSend, `{"header":"init","data":{"name":"${userName}"}}`);

  const waitChannel = eventChannel((emitter) => {
    const onReady = () => {
      console.log("Snow Ball is ready!");
      emitter(onSnowBallReady());
    };
    window.startBrowserShop({
      serverCall: doSend,
      userName,
      onReady,
    });
    return () => {};
  });

  while (true) {
    let action = yield take(waitChannel);
    yield put(action);
  }
}

function* chatMessageSend(action) {
  yield call(doSend, `{"header":"sendChatMessage","data":"${action.message}"}`);
}

function* sendUsersToShop(action) {
  yield delay(5000);
  const myId = yield select(GetMyId);

  window.addUsers(action.users.filter((v) => v.id !== myId));
}

function* sendUserToShop(action) {
  yield delay(1);
  window.addUsers([action.user]);
}

function* clearUserFromShop(action) {
  yield delay(1);
  window.removeUser(action.userID);
}

function* sendPositionsForShop(action) {
  const myId = yield select(GetMyId);
  if (myId !== action.position.id) {
    window.updatePosition(action.position);
  }
}

const WebSocketSaga = [
  takeLatest(CONNECT_TO_WS, createWebSocket),
  takeLatest(CHAT_MESSAGE_SEND, chatMessageSend),
  takeLatest(CONNECTED_TO_WS_EMULATE, emulateConnected),
  takeLatest(SAVE_USERS, sendUsersToShop),
  takeLatest(SAVE_USER, sendUserToShop),
  takeLatest(CLEAR_USER, clearUserFromShop),
  takeLatest(UPDATE_POSITIONS, sendPositionsForShop),
];

export default WebSocketSaga;
