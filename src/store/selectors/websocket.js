const GetConnectionStatus = (state) => state.websocketReducer.connectionStatus;
const GetGameMode = (state) => state.websocketReducer.selectedGameMode;
const GetGameMaxUsers = (state) => state.websocketReducer.gameModeMaxUsers;
const GetGameCurrentUsers = (state) =>
  state.websocketReducer.gameModeCurrentUsers;
const GetUserById = (uid) => (state) =>
  state.websocketReducer.gameModeCurrentUsers.find((user) => user.uid === uid);

export {
  GetConnectionStatus,
  GetGameMaxUsers,
  GetGameCurrentUsers,
  GetGameMode,
  GetUserById,
};
