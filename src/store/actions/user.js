export const STORE_USER_DATA = "STORE_USER_DATA";

export const storeUserData = (payload) => {
  return { type: STORE_USER_DATA, payload };
};
