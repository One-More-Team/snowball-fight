export const STORE_USER_DATA = "STORE_USER_DATA";
export const STORE_USER_ID = "STORE_USER_ID";
export const STORE_SDP_OFFER = "STORE_SDP_OFFER";
export const STORE_SDP_ANSWER = "STORE_SDP_ANSWER";

export const storeUserData = (payload) => {
  return { type: STORE_USER_DATA, payload };
};

export const storeUserID = (userId) => {
  return { type: STORE_USER_ID, userId };
};

export const storeSDPOffer = (userId) => {
  return { type: STORE_SDP_OFFER, userId };
};

export const storeSDPAnswer = (userId) => {
  return { type: STORE_SDP_ANSWER, userId };
};
