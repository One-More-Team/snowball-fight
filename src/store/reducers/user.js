import { STORE_USER_DATA } from "../actions/user";

const initialState = {
  wins: 0,
  losses: 0,
  photoURL: "",
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_USER_DATA:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default userReducer;
