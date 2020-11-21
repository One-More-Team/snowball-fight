const GetMyId = (state) => state.commonReducer.id;

const GetConnectionStatus = (state) => state.commonReducer.connectionStatus;

const GetGameMaxUsers = (state) => state.websocketReducer.gameModeMaxUsers;
const GetGameCurrentUsers = (state) =>
  state.websocketReducer.gameModeCurrentUsers;

export { GetMyId, GetConnectionStatus, GetGameMaxUsers, GetGameCurrentUsers };
