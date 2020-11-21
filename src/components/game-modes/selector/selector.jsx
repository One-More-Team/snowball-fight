import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { gameModes } from "../../../enums/enums";
import { initConnection } from "../../../store/actions/common";
import {
  GetGameCurrentUsers,
  GetGameMaxUsers,
} from "../../../store/selectors/websocket";

import styles from "./selector.module.scss";

const Selector = ({ url }) => {
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
    <div className={styles.wrapper}>
      <div className={styles.options}>
        {[gameModes.VERSUS, gameModes.WINGMAN, gameModes.DEATHMATCH].map(
          (m) => {
            return (
              (mode === "" || mode === m) && (
                <div
                  key={m}
                  className={styles.option}
                  onClick={() => {
                    onClickHandler(m);
                  }}
                >
                  <FormattedMessage id={m} />
                  {mode !== "" && (
                    <div className={styles["game-status"]}>
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

export default Selector;
