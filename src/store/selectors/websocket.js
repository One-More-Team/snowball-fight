const GetConnectionStatus = (state) => state.commonReducer.connectionStatus;
const GetGameMode = (state) => state.websocketReducer.selectedGameMode;
const GetGameMaxUsers = (state) => state.websocketReducer.gameModeMaxUsers;
const GetGameCurrentUsers = (state) =>
  state.websocketReducer.gameModeCurrentUsers;

export {
  GetConnectionStatus,
  GetGameMaxUsers,
  GetGameCurrentUsers,
  GetGameMode,
};
