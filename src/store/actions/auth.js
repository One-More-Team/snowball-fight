export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_IN_REQUEST = "SIGN_IN_REQUEST";
export const SIGN_OUT_REQUEST = "SIGN_OUT_REQUEST";
export const SET_SIGN_UP_ERROR = "SET_SIGN_UP_ERROR";
export const CLEAR_SIGN_UP_ERROR = "CLEAR_SIGN_UP_ERROR";
export const SET_SIGN_IN_ERROR = "SET_SIGN_IN_ERROR";
export const CLEAR_SIGN_IN_ERROR = "CLEAR_SIGN_IN_ERROR";
export const SET_USER = "SET_USER";

export const signUpRequest = (payload) => {
  return { type: SIGN_UP_REQUEST, payload };
};

export const signInRequest = (payload) => {
  return { type: SIGN_IN_REQUEST, payload };
};

export const signOutRequest = () => {
  return { type: SIGN_OUT_REQUEST };
};

export const setSignUpError = (payload) => {
  return { type: SET_SIGN_UP_ERROR, payload };
};

export const setSignInError = (payload) => {
  return { type: SET_SIGN_IN_ERROR, payload };
};

export const clearSignUpError = () => {
  return { type: CLEAR_SIGN_UP_ERROR };
};

export const clearSignInError = () => {
  return { type: CLEAR_SIGN_IN_ERROR };
};

export const setUser = (payload) => {
  return { type: SET_USER, payload };
};
