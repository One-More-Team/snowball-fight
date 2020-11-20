import {
  CHANGE_SITE_LANGUAGE,
  SAVE_SITE_TRANSLATION_DATA,
} from "../actions/site-language";

const initialState = {
  languageId: "en",
  messages: {
    "sign-in": "Sign In",
    "sign-up": "Sign Up",
    "sign-in-title": "Sign in to Snow Ball",
  },
};

const siteLanguageReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SITE_LANGUAGE:
      return {
        ...state,
        languageId: action.payload.languageId,
      };

    case SAVE_SITE_TRANSLATION_DATA:
      return {
        ...state,
        messages: action.payload.messages,
      };

    default:
      return state;
  }
};

export default siteLanguageReducer;
