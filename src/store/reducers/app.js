import { CHANGE_ROUTE } from "../actions/common";

const initialState = {
  currentRoute: "/",
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_ROUTE:
      return {
        ...state,
        currentRoute: action.newRoute,
      };

    default:
      return state;
  }
};

export default appReducer;
