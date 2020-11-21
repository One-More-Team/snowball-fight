import React from "react";

import Selector from "./selector/selector";
import Avatar from "./avatar/avatar";

import { useDispatch, useSelector } from "react-redux";
import { GetUser } from "../../store/selectors/auth";

import styles from "./game-modes.module.scss";
import { openDialog } from "../../store/actions/dialog";
import { DIALOG_ID } from "../dialog/dialog";

const GameModes = () => {
  const { displayName, photoUrl } = useSelector(GetUser);
  const dispatch = useDispatch();

  const openProfileDialog = () => dispatch(openDialog(DIALOG_ID.PROFILE));

  return (
    <>
      <div className={styles.UserSection} onClick={openProfileDialog}>
        <div className={styles.Name}>{displayName}</div>
        <Avatar photoUrl={photoUrl} />
      </div>
      <Selector />
    </>
  );
};

export default GameModes;
