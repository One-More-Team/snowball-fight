import React, { useEffect, useRef, useState } from "react";

import styles from "./game-ui.module.scss";
import TouchController from "./touch-controller/touch-controller";
import VoiceCall from "./voice-call/voice-call";

const SHOOT_DELAY_TIME = 3000;

const GameUi = () => {
  const shootFiller = useRef();
  const [lastShootTime, setLastShootTime] = useState(0);

  const reportMovementPercentages = (v) =>
    window?.touchController?.movement.reportPercentages(v);
  const reportRotationPercentages = (v) =>
    window?.touchController?.rotation.reportPercentages(v);

  const shootRequest = () => {
    if (Date.now() - lastShootTime > SHOOT_DELAY_TIME) {
      setLastShootTime(Date.now());
      window.actions.shoot();
    }
  };

  const jumpRequest = () => window.actions.jump();

  useEffect(() => {
    const calculateShootPercentage = () => {
      shootFiller.current.style.height = `${
        Math.max((Date.now() - lastShootTime) / SHOOT_DELAY_TIME) * 100
      }%`;
    };

    const interval = setInterval(calculateShootPercentage, 50);
    return () => {
      clearInterval(interval);
    };
  }, [lastShootTime]);

  return (
    <div className={styles.Wrapper}>
      <VoiceCall />
      <div className={styles.LeftController}>
        <TouchController reportPercentages={reportMovementPercentages} />
      </div>
      <div className={styles.RightController}>
        <TouchController reportPercentages={reportRotationPercentages} />
      </div>
      <div className={styles.RightActions}>
        <div className={styles.Shoot} onClick={shootRequest}>
          <div className={styles.Filler} ref={shootFiller}></div>
          <i className="fas fa-meteor"></i>
        </div>
        <div className={styles.Jump} onClick={jumpRequest}>
          <i className="fas fa-angle-double-up"></i>
        </div>
      </div>
    </div>
  );
};

export default GameUi;
