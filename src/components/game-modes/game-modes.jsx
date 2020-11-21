import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./game-modes.module.scss";
import { FormattedMessage } from "react-intl";
import { gameModes } from "../../enums/enums";
import { initConnection } from "../../store/actions/common";
import {
  GetGameCurrentUsers,
  GetGameMaxUsers,
} from "../../store/selectors/websocket";

const GameModes = () => {
  const dispatch = useDispatch();
  const connectAndStart = (mode) => dispatch(initConnection(mode));

  const maxUser = useSelector(GetGameMaxUsers);
  const currentUser = useSelector(GetGameCurrentUsers);

  const [mode, setMode] = useState("");

  const onClickHandler = (m) => {
    setMode((pre) => m);
    connectAndStart(m);
  };

  return (
    <div className={style.wrapper}>
      <div className={style.options}>
        {[gameModes.VERSUS, gameModes.WINGMAN, gameModes.DEATHMATCH].map(
          (m) => {
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
                  {mode !== "" && (
                    <div className={style["game-status"]}>
                      {currentUser}/{maxUser}
                    </div>
                  )}
                </div>
              )
            );
          }
        )}
      </div>
    </div>
  );
};

export default GameModes;
