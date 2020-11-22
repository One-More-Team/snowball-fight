const GetMemoryStats = (state) => state.performanceReducer.memoryUsageList;
const GetFPSStats = (state) => state.performanceReducer.fpsList;
const GetRenderTimeStats = (state) =>
  state.performanceReducer.renderingTimeList;

export { GetMemoryStats, GetFPSStats, GetRenderTimeStats };
