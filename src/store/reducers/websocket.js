import { connectionState } from '../../enums/enums';
import {
  CONNECTED_TO_WS,
  START_GAME,
  STORE_GAME_MODE,
  STORE_PLAYERS,
  UPDATE_PLAYER_NUMBERS,
} from '../actions/websocket';

const initialState = {
  connectionStatus: connectionState.CONNECTION_INITIAL,
  selectedGameMode: '',
  gameModeCurrentUsers: 0,
  gameModeMaxUsers: 0,
  players: [],
};

const websocketReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_GAME_MODE:
      return {
        ...state,
        selectedGameMode: action.gameMode,
        gameModeCurrentUsers: 0,
        gameModeMaxUsers: 0,
      };
    case UPDATE_PLAYER_NUMBERS:
      return {
        ...state,
        gameModeCurrentUsers: action.payload.playerNum,
        gameModeMaxUsers: action.payload.expectedPlayerNum,
      };
    case STORE_PLAYERS:
      return {
        ...state,
        players: action.payload,
      };
    case CONNECTED_TO_WS:
      return {
        ...state,
        connectionStatus: connectionState.CONNECTION_CONNECTED,
      };
    case START_GAME:
      return {
        ...state,
        connectionStatus: connectionState.CONNECTION_IN_GAME,
      };

    default:
      return state;
  }
};

export default websocketReducer;
