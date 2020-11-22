export const MEASURE = "MEASURE";

export const measure = (elapsedTime) => {
  return { type: MEASURE, payload: {elapsedTime} };
};
