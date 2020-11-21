import React from "react";
import { useDispatch } from "react-redux";

import ToggleButton from "../../components/form/toggle-button/toggle-button";
import { startCall, stopCall } from "../../store/actions/webrtc-actions";

import styles from "./voice-call.module.scss";

const VoiceCall = () => {
  const dispatch = useDispatch();

  const onChange = (value) => dispatch(value ? startCall() : stopCall);

  return (
    <div className={styles.Wrapper}>
      <i className="fas fa-headset"></i>
      <ToggleButton onChange={onChange} />
    </div>
  );
};

export default VoiceCall;
