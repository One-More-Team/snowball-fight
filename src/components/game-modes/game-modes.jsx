import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";

import { gameModes } from "../../enums/enums";
import { initConnection } from "../../store/actions/common";
import Button, { ButtonStyle } from "../form/button/button";
import { signOutRequest } from "../../store/actions/auth";

import style from "./game-modes.module.scss";

const GameModes = () => {
  const dispatch = useDispatch();
  const connectAndStart = (mode) => dispatch(initConnection(mode));
  const signOut = () => dispatch(signOutRequest());

  const [mode, setMode] = useState("");

  const onClickHandler = (m) => {
    setMode((pre) => m);
    connectAndStart(m);
  };

  return (
    <div className={style.wrapper}>
      <Button
        messageId="logout"
        icon="fa-user-plus"
        style={ButtonStyle.Secondary}
        autoWidth={false}
        onClick={signOut}
      />
      {[gameModes.VERSUS, gameModes.WINGMAN, gameModes.DEATHMATCH].map((m) => {
        return (
          (mode === "" || mode === m) && (
            <div
              key={m}
              className={style.option}
              onClick={() => {
                onClickHandler(m);
              }}
            >
              <FormattedMessage id={m} />
            </div>
          )
        );
      })}
    </div>
  );
};

export default GameModes;
