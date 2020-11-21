import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { gameModes } from "../../../enums/enums";
import { signOutRequest } from "../../../store/actions/auth";
import { initConnection } from "../../../store/actions/common";
import {
  GetGameCurrentUsers,
  GetGameMaxUsers,
} from "../../../store/selectors/websocket";
import Button, { ButtonStyle } from "../../form/button/button";

import styles from "./selector.module.scss";

const Selector = ({ url }) => {
  const dispatch = useDispatch();
  const connectAndStart = (mode) => dispatch(initConnection(mode));
  const signOut = () => dispatch(signOutRequest());

  const maxUser = useSelector(GetGameMaxUsers);
  const currentUser = useSelector(GetGameCurrentUsers);

  const [mode, setMode] = useState("");

  const onClickHandler = (m) => {
    setMode((pre) => m);
    connectAndStart(m);
  };
  return (
    <div className={styles.wrapper}>
      <Button
        messageId="sign-out"
        icon="fa-sign-out-alt"
        style={ButtonStyle.Secondary}
        onClick={signOut}
        autoWidth={false}
      />
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
