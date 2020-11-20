import { connectionState, snowBallState } from "../../enums/enums";
import {
  CHAT_MESSAGE_RECEIVE,
  CLEAR_USER,
  CONNECTED_TO_WS,
  CONNECT_TO_WS,
  ON_SNOW_BALL_READY,
  SAVE_ID,
  SAVE_PRODUCTS,
  SAVE_USER,
  SAVE_USERS,
} from "../actions/websocket";

const initialState = {
  testData: "Initial test data",
  connectionStatus: connectionState.CONNECTION_INITIAL,
  snowBallState: snowBallState.INITIAL,
  displayName: "",
  id: "",
  messages: [],
  products: [],
  clientList: [],
};

let uniqueChatId = 0;

const websocketReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_USERS:
      return {
        ...state,
        clientList: action.users,
      };
    case SAVE_USER:
      return {
        ...state,
        clientList: [...state.clientList, action.user],
      };
    case CLEAR_USER:
      return {
        ...state,
        clientList: state.clientList.filter((a) => a.id !== action.userID),
      };
    case SAVE_ID:
      return {
        ...state,
        id: action.id,
      };
    case SAVE_PRODUCTS:
      return {
        ...state,
        products: [...state.products, action.products],
      };
    case CONNECT_TO_WS:
      return {
        ...state,
        connectionStatus: connectionState.CONNECTION_CONNECTING,
        displayName: action.displayName,
      };
    case CONNECTED_TO_WS:
      return {
        ...state,
        connectionStatus: connectionState.CONNECTION_CONNECTED,
      };
    case ON_SNOW_BALL_READY:
      return {
        ...state,
        snowBallState: snowBallState.READY,
      };
    case CHAT_MESSAGE_RECEIVE:
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            uid: uniqueChatId++,
            ...action.message,
            name: state.clientList.find((user) => user.id === action.message.id)
              .name,
          },
        ],
      };
    default:
      return state;
  }
};

export default websocketReducer;
