const connectionState = {
  CONNECTION_INITIAL: "CONNECTION_INITIAL",
  CONNECTION_CONNECTING: "CONNECTION_CONNECTING",
  CONNECTION_CONNECTED: "CONNECTION_CONNECTED",
  CONNECTION_HAD_ERROR: "CONNECTION_ERROR",
};

const gameModes = {
  VERSUS: "VERSUS",
  WINGMAN: "WINGMAN",
  DEATHMATCH: "DEATHMATCH",
};

const ServerMessages = {
  PLAYERNUM: "playerNum",
  READY: "ready",
};

export { connectionState, gameModes, ServerMessages };
