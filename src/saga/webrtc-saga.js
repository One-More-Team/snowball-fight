import { eventChannel } from "redux-saga";
import {
  call,
  fork,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";

import {
  saveMediaDevices,
  startCall,
  saveInnerStream,
  stopCall,
} from "../store/actions/webrtc-actions";
import { error, info } from "../utils/logger";
import { doSend } from "./websocket-saga";
import { storeSDPAnswer, storeSDPOffer } from "../store/actions/user";
import { GetIsInitedByCurrentUser } from "../store/selectors/webrtc-selector";
import { showNotification } from "../store/actions/notifications";

const servers = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun3.l.google.com:19302" },
  { urls: "stun:stun4.l.google.com:19302" },
  { urls: "stun:stun.services.mozilla.com" },
  { urls: "stun:stun.stunprotocol.org:3478" },
];

let peerConnection = null;
let dataChannel = null;

function* initPeerConnection() {
  const serverId = Math.floor(Math.random() * servers.length);
  const server = servers[serverId];
  info(`Selected Stun server: ${server.urls}`);
  peerConnection = new RTCPeerConnection({
    iceServers: [server],
  });

  yield call(addPeerConnectionListener);
}

function* addPeerConnectionListener() {
  const peerConnectionChannel = eventChannel((emit) => {
    peerConnection.onaddstream = (e) => emit({ eventType: "onaddstream", e });
    peerConnection.ondatachannel = (e) =>
      emit({ eventType: "ondatachannel", e });
    peerConnection.oniceconnectionstatechange = (e) =>
      emit({ eventType: "oniceconnectionstatechange", e });
    return () => {
      peerConnection.onaddstream = null;
      peerConnection.ondatachannel = null;
      peerConnection.oniceconnectionstatechange = null;
    };
  });
  yield takeEvery(peerConnectionChannel, peerConnectionChannelHandler);
  info(`Peer connection listeners were added`);
}

function* peerConnectionChannelHandler({ eventType, e }) {
  info(`On peer connection event: ${eventType}`);
  switch (eventType) {
    case "onaddstream":
      yield put(saveInnerStream(e.stream));
      info(`Secondary stream was added`);
      break;
    default:
      break;
  }
}

function* _startCall(sdp) {
  yield fork(initPeerConnection);
  const constraints = { audio: true, video: false };
  info(`Manual stream start process: ${sdp}`);
  try {
    const mediaDevices = yield navigator.mediaDevices.getUserMedia(constraints);
    yield put(saveMediaDevices(mediaDevices));
    info(`Available media devices are saved`);

    peerConnection.addStream(mediaDevices);
    dataChannel = peerConnection.createDataChannel(`snowball-fight-voice-call`);
    const dataChannelChannel = eventChannel((emit) => {
      dataChannel.onopen = (e) => {
        emit({ eventType: "onOpened", e });
      };
      dataChannel.onmessage = (e) => {
        emit({ eventType: "onMessage", e });
      };
      return () => {
        dataChannel.onopen = null;
        dataChannel.onmessage = null;
      };
    });
    yield takeEvery(dataChannelChannel, dataChannelChannelHandler);
    info(`Data channel listeners were added`);

    const isInitedByCurrentUser = yield select(GetIsInitedByCurrentUser);

    if (isInitedByCurrentUser) {
      yield peerConnection
        .createOffer()
        .then((d) => peerConnection.setLocalDescription(d));
      info(
        `Local description was added to peer connection (Inited by current user)`
      );
    } else {
      var desc = new RTCSessionDescription({ type: "offer", sdp });
      peerConnection
        .setRemoteDescription(desc)
        .then(() => peerConnection.createAnswer())
        .then((d) => peerConnection.setLocalDescription(d))
        .catch(error);
      info(
        `Local description was added to peer connection (Inited by other user)`
      );
    }

    const onIceCandidateChannel = eventChannel((emit) => {
      peerConnection.onicecandidate = (e) => {
        if (e.candidate) return;
        emit(peerConnection.localDescription.sdp);
      };
      return () => (peerConnection.onicecandidate = null);
    });
    yield takeEvery(onIceCandidateChannel, onIceCandidateChannelHandler);
    info(`Ice candidate listener was added`);
  } catch (e) {
    console.warn(`getUserMediaHandler error: ${e}`);
  }
}

function* dataChannelChannelHandler({ eventType, e }) {
  info(eventType, e);
  yield; // temporary
}

function* onIceCandidateChannelHandler(sdp) {
  info(`On ice candidate event...`);
  const isInitedByCurrentUser = yield select(GetIsInitedByCurrentUser);

  yield call(doSend, {
    header: isInitedByCurrentUser ? "sendWebRTCOffer" : "sendWebRTCAnswer",
    data: { sdp },
  });
  info(`SDP was saved to database`);
  info(`Secondary stream listener was added`);
  const answer = yield take(storeSDPAnswer);
  info(`Stream request was received`);
  const desc = new RTCSessionDescription({
    type: "answer",
    sdp: answer.payload.sdp,
  });
  peerConnection.setRemoteDescription(desc).catch(error);

  if (!isInitedByCurrentUser) {
    yield call(_startCall, sdp);
  }
}

function* _stopCall() {
  yield;
}

function* _storeSDPOffer(action) {
  yield fork(initPeerConnection);
  const constraints = { audio: true, video: false };
  info(`Auto stream start process: ${action.payload}`);
  yield put(showNotification(`Voice chat activation in progress...`));
  try {
    const mediaDevices = yield navigator.mediaDevices.getUserMedia(constraints);
    yield put(saveMediaDevices(mediaDevices));
    info(`Available media devices are saved`);

    peerConnection.addStream(mediaDevices);
    dataChannel = peerConnection.createDataChannel(`snowball-fight-voice-call`);
    const dataChannelChannel = eventChannel((emit) => {
      dataChannel.onopen = (e) => {
        emit({ eventType: "onOpened", e });
      };
      dataChannel.onmessage = (e) => {
        emit({ eventType: "onMessage", e });
      };
      return () => {
        dataChannel.onopen = null;
        dataChannel.onmessage = null;
      };
    });
    yield takeEvery(dataChannelChannel, dataChannelChannelHandler);
    info(`Data channel listeners were added`);

    var desc = new RTCSessionDescription({
      type: "offer",
      sdp: action.payload.sdp,
    });
    peerConnection
      .setRemoteDescription(desc)
      .then(() => peerConnection.createAnswer())
      .then((d) => peerConnection.setLocalDescription(d))
      .catch(error);
    info(`Local description was added ro connection`);

    const onIceCandidateChannel = eventChannel((emit) => {
      peerConnection.onicecandidate = (e) => {
        if (e.candidate) return;
        emit(peerConnection.localDescription.sdp);
      };
      return () => (peerConnection.onicecandidate = null);
    });
    yield takeEvery(onIceCandidateChannel, onIceCandidateChannelHandler);
    info(`Ice candidate listener was added`);
  } catch (e) {
    console.warn(`getUserMediaHandler error: ${e}`);
  }
}

const Stream = [
  takeLatest(startCall().type, _startCall),
  takeLatest(stopCall().type, _stopCall),
  takeLatest(storeSDPOffer().type, _storeSDPOffer),
];

export default Stream;
