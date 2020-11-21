import React from "react";
import { useDispatch } from "react-redux";

import { guestSignInRequest } from "../../../store/actions/auth";

import styles from "./guest.module.scss";

const Guest = () => {
  const dispatch = useDispatch();
  const guestSignIn = () => dispatch(guestSignInRequest());

  return (
    <div className={styles.Wrapper} onClick={guestSignIn}>
      Play as Guest<i className="fas fa-play-circle"></i>
    </div>
  );
};

export default Guest;
