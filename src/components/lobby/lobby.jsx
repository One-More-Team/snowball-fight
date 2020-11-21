import React, { useState } from "react";
import { useDispatch } from "react-redux";
import style from "./lobby.module.scss";
import { FormattedMessage } from "react-intl";
import { gameModes } from "../../enums/enums";
import { initConnection } from "../../store/actions/common";

const Lobby = () => {
  const dispatch = useDispatch();
  const connectAndStart = (mode) => dispatch(initConnection(mode));

  const [mode, setMode] = useState("");

  const onClickHandler = (m) => {
    setMode((pre) => m);
    connectAndStart(m);
  };

  return <div className={style.wrapper}>Lobby</div>;
};

export default Lobby;
