import {
  SAVE_MEDIA_DEVICES,
  START_CALL,
  SAVE_INNER_STREAM,
  STOP_CALL,
} from "../actions/webrtc-actions";

export const STREAM_STATE = {
  INITIAL_STATE: "INITIAL_STATE",
  WAITING_FOR_PERMISSION: "WAITING_FOR_PERMISSION",
  IN_PROGRESS: "IN_PROGRESS",
};

const initialState = {
  state: STREAM_STATE.INITIAL_STATE,
  mediaDevices: null,
  startTime: 0,
  innerStream: [],
  isInitedByCurrentUser: false,
};

const webRTCReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_CALL:
      return {
        ...state,
        state: STREAM_STATE.WAITING_FOR_PERMISSION,
        isInitedByCurrentUser: true,
      };

    case STOP_CALL:
      return {
        ...state,
        state: STREAM_STATE.INITIAL_STATE,
        isInitedByCurrentUser: false,
      };

    case SAVE_MEDIA_DEVICES:
      console.log(action.payload);
      return {
        ...state,
        mediaDevices: action.payload,
        state: STREAM_STATE.IN_PROGRESS,
        startTime: window.performance.now(),
      };

    case SAVE_INNER_STREAM:
      return {
        ...state,
        innerStreams: action.payload,
      };

    default:
      return state;
  }
};

export default webRTCReducer;
