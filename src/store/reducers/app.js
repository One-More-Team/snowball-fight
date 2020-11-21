import { SET_USER } from "../actions/auth";

const initialState = {
  isUserDataLoaded: false,
  isSiteinited: false,
};

const getSiteInitedState = ({ state, isUserDataLoaded }) =>
  state.isUserDataLoaded || isUserDataLoaded;

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        isUserDataLoaded: true,
        isSiteinited: getSiteInitedState({ state, isUserDataLoaded: true }),
      };

    default:
      return state;
  }
};

export default appReducer;
