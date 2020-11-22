import {
  MEASURE,
} from "../actions/performance";

const maxSampleNum = 10;

const initialState = {
  memoryUsageList: [],
  fpsList: [],
  renderingTimeList: [],
};

const addNewSample = (sampleList, sample) => {
  sampleList = [...sampleList];
  sampleList.push(sample);

  if (sampleList.length > maxSampleNum) {
    sampleList.shift();
  }

  return sampleList;
}

const performanceReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case MEASURE:
      const memory = performance.memory;
      let memoryUsageList = [];

      if (memory) {
        const memoryUsage = {
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          totalJSHeapSize: memory.totalJSHeapSize,
          usedJSHeapSize: memory.usedJSHeapSize,
        };

        console.log(JSON.stringify(memoryUsage));

        memoryUsageList = addNewSample(state.memoryUsageList, memoryUsage);
      }

      const measurementList = performance.getEntriesByName('threejs-render-measure');

      const fps = measurementList.length / (payload.elapsedTime / 1000);
      const avarageRenderingTime = measurementList
        .map(performanceMeasure => performanceMeasure.duration)
        .reduce((sum, val) => (sum + val) / measurementList.length, 0);

      performance.clearMarks('threejs-render-start-mark');
      performance.clearMarks('threejs-render-end-mark');
      performance.clearMeasures('threejs-render-measure');

      console.log(`fps: ${fps}`);
      console.log(`avarageRenderingTime: ${avarageRenderingTime}`);

      return {
        ...state,
        fpsList: addNewSample(state.fpsList, fps),
        renderingTimeList: addNewSample(state.renderingTimeList, avarageRenderingTime),
        memoryUsageList,
      };

    default:
      return state;
  }
};

export default performanceReducer;
