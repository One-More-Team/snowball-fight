const GetState = (state) => state.webRTCReducer.state;
const GetMediaDevices = (state) => state.webRTCReducer.mediaDevices;
const GetIsAudioOnly = (state) => state.webRTCReducer.isAudioOnly;
const GetInnerStream = (state) => state.webRTCReducer.innerStream;
const GetIsInitedByCurrentUser = (state) =>
  state.webRTCReducer.isInitedByCurrentUser;

export {
  GetState,
  GetMediaDevices,
  GetIsAudioOnly,
  GetInnerStream,
  GetIsInitedByCurrentUser,
};
