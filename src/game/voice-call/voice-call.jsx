import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import ToggleButton from "../../components/form/toggle-button/toggle-button";
import { startCall, stopCall } from "../../store/actions/webrtc-actions";
import {
  GetInnerStream,
  GetMediaDevices,
} from "../../store/selectors/webrtc-selector";

import styles from "./voice-call.module.scss";

const VoiceCall = () => {
  const dispatch = useDispatch();

  const outerVideo = useRef(null);
  const innerVideo = useRef(null);
  const mediaDevices = useSelector(GetMediaDevices);
  const innerStream = useSelector(GetInnerStream);

  useEffect(() => {
    outerVideo.current.srcObject = mediaDevices;
  }, [mediaDevices]);

  useEffect(() => {
    innerVideo.current.srcObject = innerStream[0];
  }, [innerStream]);

  const onChange = (value) => dispatch(value ? startCall() : stopCall());

  return (
    <div className={styles.Wrapper}>
      <audio ref={outerVideo} autoPlay playsInline muted />
      <audio ref={innerVideo} autoPlay playsInline />
      <i className="fas fa-headset"></i>
      <ToggleButton onChange={onChange} />
    </div>
  );
};

export default VoiceCall;
