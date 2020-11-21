import React from "react";

import styles from "./game-ui.module.scss";
import TouchController from "./touch-controller/touch-controller";

const GameUi = () => {
  const reportMovementPercentages = (v) =>
    window?.touchController?.movement.reportPercentages(v);
  const reportRotationPercentages = (v) =>
    window?.touchController?.rotation.reportPercentages(v);

  return (
    <div className={styles.Wrapper}>
      <div className={styles.LeftController}>
        <TouchController reportPercentages={reportMovementPercentages} />
      </div>
      <div className={styles.RightController}>
        <TouchController reportPercentages={reportRotationPercentages} />
      </div>
    </div>
  );
};

export default GameUi;
