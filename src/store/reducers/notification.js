import {
  HIDE_NOTIFICATION,
  SHOW_NEXT_NOTIFICATION,
  SHOW_NOTIFICATION,
} from "../actions/notifications";

const initialState = {
  activeNotification: null,
  notificationQueue: [],
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return {
        ...state,
        notificationQueue:
          state.activeNotification === null &&
          state.notificationQueue.length === 0
            ? []
            : [...state.notificationQueue, action.payload],
        activeNotification:
          state.activeNotification === null
            ? action.payload
            : state.activeNotification,
      };

    case SHOW_NEXT_NOTIFICATION:
      return {
        ...state,
        activeNotification:
          state.notificationQueue?.length === 0
            ? null
            : state.notificationQueue[0],
        notificationQueue: state.notificationQueue.filter(
          (_, index) => index > 0
        ),
      };

    case HIDE_NOTIFICATION:
      return {
        ...state,
        activeNotification: null,
      };

    default:
      return state;
  }
};

export default notificationReducer;
