import React, { useState } from "react";
import { useDispatch } from "react-redux";
import style from "./game-modes.module.scss";
import { FormattedMessage } from "react-intl";
import { gameModes } from "../../enums/enums";
import { initConnection } from "../../store/actions/common";

const GameModes = () => {
  const dispatch = useDispatch();
  const connectAndStart = (mode) => dispatch(initConnection(mode));

  const [mode, setMode] = useState("");

  const onClickHandler = (m) => {
    setMode((pre) => m);
    connectAndStart(m);
  };

  return (
    <div className={style.wrapper}>
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