export const SEND_CHAT_MESSAGE = "SEND_CHAT_MESSAGE";
export const CONNECT_TO_WS = "CONNECT_WS";
export const CONNECTED_TO_WS = "CONNECTED_TO_WS";
export const CONNECTED_TO_WS_EMULATE = "CONNECTED_TO_WS_EMULATE";

export const SAVE_ID = "SAVE_ID";
export const GET_ID = "GET_ID";

export const ON_SNOW_BALL_READY = "ON_SNOW_BALL_READY";
export const SYNC_POSITION = "SYNC_POSITION";

export const UPDATE_POSITIONS = "UPDATE_POSITIONS";

export const SAVE_PRODUCTS = "SAVE_PRODUCTS";

export const UPDATE_PLAYER_NUMBERS = "SAVE_PRODUCTS";

export const updatePlayerNumbers = (playerInfo) => ({
  type: UPDATE_PLAYER_NUMBERS,
  playerInfo,
});

export const updatePositions = (position) => ({
  type: UPDATE_POSITIONS,
  position,
});

export const saveId = (id) => ({
  type: SAVE_ID,
  id,
});

export const saveProducts = (shops) => ({
  type: SAVE_PRODUCTS,
  shops,
});

export const connectWS = (requestedDisplayName) => ({
  type: CONNECT_TO_WS,
  displayName: requestedDisplayName,
});

export const connectedToWS = () => ({
  type: CONNECTED_TO_WS,
});

export const connectedToWSEmulate = () => ({
  type: CONNECTED_TO_WS_EMULATE,
});

export const onSnowBallReady = () => ({
  type: ON_SNOW_BALL_READY,
});

export const syncPosition = (position) => ({
  type: SYNC_POSITION,
  position: position,
});
