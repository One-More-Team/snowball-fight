export const INIT_APP = "INIT_APP";
export const INIT_CONNECTION = "INIT_CONNECTION";
export const CHANGE_ROUTE = "CHANGE_ROUTE";

export const initApp = () => {
  return { type: INIT_APP };
};

export const initConnection = (gameMode) => {
  return { type: INIT_CONNECTION, gameMode };
};

export const changeRoute = (route) => {
  return { type: CHANGE_ROUTE, newRoute: route };
};
