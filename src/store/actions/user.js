export const STORE_USER_DATA = "STORE_USER_DATA";
export const STORE_USER_ID = "STORE_USER_ID";

export const storeUserData = (payload) => {
  return { type: STORE_USER_DATA, payload };
};

export const storeUserID = (userId) => {
  return { type: STORE_USER_ID, userId };
};
