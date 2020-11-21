import React from "react";

import Selector from "./selector/selector";
import Avatar from "./avatar/avatar";

import { useSelector } from "react-redux";
import { GetUser } from "../../store/selectors/auth";

import styles from "./game-modes.module.scss";

const GameModes = () => {
  const { displayName, photoUrl } = useSelector(GetUser);
  return (
    <>
      <div className={styles.UserSection}>
        <div className={styles.Name}>{displayName}</div>
        <Avatar photoUrl={photoUrl} />
      </div>
      <Selector />
    </>
  );
};

export default GameModes;
