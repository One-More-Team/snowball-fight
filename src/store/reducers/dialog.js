import { CLOSE_DIALOG, OPEN_DIALOG } from "../actions/dialog";

const initialState = {
  selectedDialogId: null,
};

const dialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_DIALOG:
      return {
        ...state,
        selectedDialogId: action.payload,
      };

    case CLOSE_DIALOG:
      return {
        ...state,
        selectedDialogId: null,
      };

    default:
      return state;
  }
};

export default dialogReducer;
