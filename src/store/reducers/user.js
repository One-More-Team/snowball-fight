import { STORE_USER_DATA, STORE_USER_ID } from "../actions/user";

const initialState = {
  wins: 0,
  losses: 0,
  photoURL: "",
  id: "",
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_USER_DATA:
      return {
        ...state,
        ...action.payload,
      };
    case STORE_USER_ID:
      return {
        ...state,
        id: action.userId,
      };

    default:
      return state;
  }
};

export default userReducer;
