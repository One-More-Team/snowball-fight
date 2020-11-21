const GetActiveNotification = (state) =>
  state.notificationReducer.activeNotification;

const GetNotificationQueueLength = (state) =>
  state.notificationReducer.notificationQueue.length;

export { GetActiveNotification, GetNotificationQueueLength };
