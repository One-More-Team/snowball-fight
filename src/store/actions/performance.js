export const RECORD_FPS = "RECORD_FPS";
export const RECORD_MEMORY_USAGE = "RECORD_MEMORY_USAGE";
export const RECORD_DATA_TRANSFER = "RECORD_DATA_TRANSFER";

export const recordFps = (fps) => {
  return { type: RECORD_FPS, fps };
};

export const recordMemoryUsage = (memoryUsage) => {
  return { type: RECORD_MEMORY_USAGE, memoryUsage };
};

export const recordDataTransfer = (dataTransfer) => {
  return { type: RECORD_DATA_TRANSFER, dataTransfer };
};
