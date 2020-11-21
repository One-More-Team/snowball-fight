import {
    RECORD_FPS,
    RECORD_MEMORY_USAGE,
    RECORD_DATA_TRANSFER,
} from "../actions/performance";

const maxSampleNum = 10;

const initialState = {
  fpsRecords: [],
  memoryUsageRecors: [],
  dataTransferRecords: [],
};

const addNewSample = (sampleList, sample) => {
  sampleList = [...sampleList];
  sampleList.push(sample);

  if (sampleList.length > maxSampleNum) {
    sampleList.shift();
  }
}

const performanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECORD_FPS:
      return {
        ...state,
        fpsRecords: addNewSample(state.fpsRecords, action.fps),
      }

    case RECORD_MEMORY_USAGE:
      return {
        ...state,
        memoryUsageRecors: addNewSample(state.memoryUsageRecors, action.memoryUsage),
      }

    case RECORD_DATA_TRANSFER:
      return {
        ...state,
        dataTransferRecords: addNewSample(state.dataTransferRecords, action.dataTransfer),
      }

    default:
      return state;
  }
};

export default performanceReducer;
