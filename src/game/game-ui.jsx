import React from "react";

import styles from "./game-ui.module.scss";
import TouchController from "./touch-controller/touch-controller";

const GameUi = () => {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.LeftController}>
        <TouchController />
      </div>
      <div className={styles.RightController}>
        <TouchController />
      </div>
    </div>
  );
};

export default GameUi;
