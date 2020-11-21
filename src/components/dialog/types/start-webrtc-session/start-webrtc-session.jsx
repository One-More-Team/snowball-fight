import React from "react";
import { /* useDispatch,  */ useSelector } from "react-redux";

import { GetUser } from "../../../../store/selectors/auth";
import Button, { ButtonStyle } from "../../../form/button/button";

import styles from "./start-webrtc-session.module.scss";

const StartWebRTCSession = ({ close }) => {
  //const dispatch = useDispatch();
  const user = useSelector(GetUser);

  const startWebRTCSessionRequest = () => {}; //dispatch(startSession());

  return (
    <>
      <h1>
        <i className="fas fa-headset"></i> Are you ready to start a voice call
        with <span className={styles.Name}>{user.displayName}</span>
      </h1>
      <div className={styles.Actions}>
        <div className={styles.Action}>
          <Button
            label="Let's start!"
            icon="fa-sign-out-alt"
            style={ButtonStyle.Primary}
            onClick={startWebRTCSessionRequest}
            autoWidth={false}
          />
          <Button
            label="Cancel"
            icon="fa-sign-out-alt"
            style={ButtonStyle.Tertiary}
            onClick={close}
            autoWidth={false}
          />
        </div>
      </div>
    </>
  );
};

export default StartWebRTCSession;
