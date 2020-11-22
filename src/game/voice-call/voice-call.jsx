import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import ToggleButton from "../../components/form/toggle-button/toggle-button";
import Loader from "../../components/spinner/loader";
import { startCall, stopCall } from "../../store/actions/webrtc-actions";
import { STREAM_STATE } from "../../store/reducers/webrtc-reducer";
import {
  GetInnerStream,
  GetMediaDevices,
  GetState,
} from "../../store/selectors/webrtc-selector";

import styles from "./voice-call.module.scss";

const VoiceCall = () => {
  const dispatch = useDispatch();

  const outerVideo = useRef(null);
  const innerVideo = useRef(null);
  const mediaDevices = useSelector(GetMediaDevices);
  const innerStream = useSelector(GetInnerStream);
  const webRTCState = useSelector(GetState);

  useEffect(() => {
    if (mediaDevices) outerVideo.current.srcObject = mediaDevices;
  }, [mediaDevices]);

  useEffect(() => {
    if (innerStream) innerVideo.current.srcObject = innerStream;
  }, [innerStream]);

  const onChange = (value) => dispatch(value ? startCall() : stopCall());

  return (
    <div
      className={`${styles.Wrapper} ${
        webRTCState === STREAM_STATE.WAITING_FOR_PERMISSION && styles.Waiting
      } ${webRTCState === STREAM_STATE.IN_PROGRESS && styles.InProgress}`}
    >
      <audio ref={outerVideo} autoPlay playsInline muted />
      <audio ref={innerVideo} autoPlay playsInline />
      <i className="fas fa-headset"></i>
      <ToggleButton onChange={onChange} />
      {webRTCState === STREAM_STATE.WAITING_FOR_PERMISSION && (
        <Loader className={styles.Loader} />
      )}
    </div>
  );
};

export default VoiceCall;
