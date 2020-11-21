import md5 from "md5";
import {
  SET_SIGN_UP_ERROR,
  SET_SIGN_IN_ERROR,
  SET_USER,
  CLEAR_SIGN_IN_ERROR,
  CLEAR_SIGN_UP_ERROR,
  SIGN_UP_REQUEST,
  SIGN_IN_REQUEST,
  GUEST_SIGN_IN_REQUEST,
} from "../actions/auth";

const initialState = {
  user: null,
  signUpError: null,
  signInError: null,
  isSignUpInProgress: false,
  isSignInInProgress: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_UP_REQUEST:
      return {
        ...state,
        isSignUpInProgress: true,
        signUpError: null,
      };

    case SIGN_IN_REQUEST:
    case GUEST_SIGN_IN_REQUEST:
      return {
        ...state,
        isSignInInProgress: true,
        signInError: null,
      };

    case SET_SIGN_UP_ERROR:
      return {
        ...state,
        signUpError: action.payload,
        isSignUpInProgress: false,
      };

    case SET_SIGN_IN_ERROR:
      return {
        ...state,
        signInError: action.payload,
        isSignInInProgress: false,
      };

    case CLEAR_SIGN_UP_ERROR:
      return {
        ...state,
        signUpError: null,
      };

    case CLEAR_SIGN_IN_ERROR:
      return {
        ...state,
        signInError: null,
      };

    case SET_USER:
      return {
        ...state,
        user:
          action.payload === null
            ? null
            : {
                ...action.payload,
                displayName:
                  action.payload?.displayName ||
                  `Guest-${Math.floor(Math.random() * 9999)}`,
                photoUrl:
                  action.payload?.photoUrl ||
                  `https://gravatar.com/avatar/${md5(
                    action.payload?.uid || "empty"
                  )}?d=identicon`,
              },
        isSignInInProgress: false,
        isSignUpInProgress: false,
      };

    default:
      return state;
  }
};

export default authReducer;
