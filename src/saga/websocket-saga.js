import { eventChannel } from 'redux-saga';
import {
  call,
  put,
  take,
  delay,
  takeEvery,
  fork,
  select,
} from 'redux-saga/effects';
import { ServerMessages } from '../enums/enums';
import { INIT_CONNECTION } from '../store/actions/common';
import { storeUserID } from '../store/actions/user';
import {
  startGame,
  storePlayers,
  updateGameMode,
  CONNECTED_TO_WS,
  connectedToWS,
  updatePlayerNumbers,
} from '../store/actions/websocket';
import { GetUser } from '../store/selectors/auth';

import { GetGameMode } from '../store/selectors/websocket';
import { info } from '../utils/logger';

const JOIN = 'join';
const LEAVE = 'leave';
const UPDATEPOSITION = 'updatePosition';

const wsUri = 'wss://snowball-fight.herokuapp.com';
let websocket;

function closeWebSocket() {
  websocket.close();
}

function* connectAndStart({ gameMode }) {
  yield delay(500);
  info('New game selected:', gameMode);

  const prevGameMode = yield select(GetGameMode);
  info('Previous Game:', prevGameMode);
  if (prevGameMode !== '' && prevGameMode !== gameMode) {
    info('Game change detected -> Closing WSS');
    yield call(closeWebSocket);
  }

  yield fork(createWebSocket);
  yield take(CONNECTED_TO_WS);
  yield put(updateGameMode(gameMode));

  const user = select(GetUser);

  yield call(doSend, {
    header: 'start',
    data: { gameMode: gameMode.toLowerCase(), userName: user.displayName },
  });
}

function* createWebSocket() {
  websocket = new WebSocket(wsUri);
  websocket.onclose = (evt) => onClose(evt);
  websocket.onerror = (evt) => onError(evt);

  const channel = yield call(subscribe, websocket);
  while (true) {
    const action = yield take(channel);

    yield put(action);
  }
}

function subscribe(socket) {
  return new eventChannel((emit) => {
    socket.onopen = () => {
      info('WS CONNECTED');
      emit(connectedToWS());
    };

    socket.onmessage = (evt) => {
      const rawData = JSON.parse(evt.data);
      const command = rawData.header;

      switch (command) {
        case ServerMessages.PLAYERNUM: {
          info(
            'Player Number Updated ',
            rawData.data.playerNum,
            rawData.data.expectedPlayerNum,
          );
          emit(updatePlayerNumbers(rawData.data));
          break;
        }
        case ServerMessages.READY: {
          emit(storeUserID(rawData.data.id));
          emit(storePlayers(rawData.data.players));
          emit(storePlayers(rawData.data.players));
          emit(startGame());
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
          // todo
        }
      }
    };

    return () => {};
  });
}

function onClose() {
  info('DISCONNECTED');
}

function onError() {
  info('ERROR');
}

function doSend(msgObj) {
  websocket.send(JSON.stringify(msgObj));
}

const WebSocketSaga = [
  takeEvery(INIT_CONNECTION, connectAndStart),
  // takeEvery(CONNECTED_TO_WS, showLobby),
];

export default WebSocketSaga;
