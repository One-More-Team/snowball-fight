export const SHOW_NOTIFICATION = "SHOW_NOTIFICATION";
export const SHOW_NEXT_NOTIFICATION = "SHOW_NEXT_NOTIFICATION";
export const HIDE_NOTIFICATION = "HIDE_NOTIFICATION";

export const showNotification = (payload) => {
  return { type: SHOW_NOTIFICATION, payload };
};

export const showNextNotification = () => {
  return { type: SHOW_NEXT_NOTIFICATION };
};

export const hideNotification = () => {
  return { type: HIDE_NOTIFICATION };
};
