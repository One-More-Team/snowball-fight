export const START_CALL = "START_CALL";
export const STOP_CALL = "STOP_CALL";
export const SAVE_MEDIA_DEVICES = "SAVE_MEDIA_DEVICES";
export const SAVE_INNER_STREAM = "SAVE_INNER_STREAM";

export const startCall = (payload) => {
  return { type: START_CALL, payload };
};

export const stopCall = (payload) => {
  return { type: STOP_CALL, payload };
};

export const saveMediaDevices = (payload) => {
  return { type: SAVE_MEDIA_DEVICES, payload };
};

export const saveInnerStream = (payload) => {
  return { type: SAVE_INNER_STREAM, payload };
};
