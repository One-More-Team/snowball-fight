export const OPEN_DIALOG = "OPEN_DIALOG";
export const CLOSE_DIALOG = "CLOSE_DIALOG";

export const openDialog = (payload) => {
  return { type: OPEN_DIALOG, payload };
};

export const closeDialog = () => {
  return { type: CLOSE_DIALOG };
};
