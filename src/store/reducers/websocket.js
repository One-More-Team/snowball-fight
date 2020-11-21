import { connectionState } from "../../enums/enums";
import { INIT_CONNECTION } from "../actions/common";
import {
  CONNECTED_TO_WS,
  ON_SNOW_BALL_READY,
  SAVE_ID,
  SAVE_PRODUCTS,
  UPDATE_PLAYER_NUMBERS,
} from "../actions/websocket";

const initialState = {
  connectionStatus: connectionState.CONNECTION_INITIAL,
  selectedGameMode: "",
  gameModeCurrentUsers: 0,
  gameModeMaxUsers: 0,
  id: "",
};

const websocketReducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_CONNECTION:
      return {
        ...state,
        selectedGameMode: action.payload,
      };
    case UPDATE_PLAYER_NUMBERS:
      return {
        ...state,
        gameModeCurrentUsers: action.playerInfo.playerNum,
        gameModeMaxUsers: action.playerInfo.expectedPlayerNum,
      };
    case CONNECTED_TO_WS:
      return {
        ...state,
        connectionStatus: connectionState.CONNECTION_CONNECTED,
      };

    default:
      return state;
  }
};

export default websocketReducer;
