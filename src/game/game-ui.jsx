import React, { useEffect, useRef, useState } from "react";

import styles from "./game-ui.module.scss";
import TouchController from "./touch-controller/touch-controller";
import VoiceCall from "./voice-call/voice-call";
import Stats from "../components/performance/stat.jsx";
import { useSelector } from "react-redux";
import {
  GetFPSStats,
  GetMemoryStats,
  GetRenderTimeStats,
} from "../store/selectors/performance";

const SHOOT_DELAY_TIME = 1000;

const GameUi = () => {
  const [showStats, setShowStats] = useState(false);
  const shootFiller = useRef();
  const [lastShootTime, setLastShootTime] = useState(0);

  const reportMovementPercentages = (v) =>
    window?.touchController?.movement.reportPercentages(v);
  const reportRotationPercentages = (v) =>
    window?.touchController?.rotation.reportPercentages(v);

  const calculateShootPercentage = () => {
    shootFiller.current.style.height = `${
      Math.max((Date.now() - lastShootTime) / SHOOT_DELAY_TIME) * 100
    }%`;
  };

  const shootRequest = () => {
    if (Date.now() - lastShootTime > SHOOT_DELAY_TIME) {
      setLastShootTime(Date.now());
      window.actions.shoot();
      calculateShootPercentage();
    }
  };

  const jumpRequest = () => window.actions.jump();

  const toggleStats = () => setShowStats((prev) => !prev);

  useEffect(() => {
    const interval = setInterval(calculateShootPercentage, 50);
    return () => {
      clearInterval(interval);
    };
  });

  const memoryStats = useSelector(GetMemoryStats);
  const fpsStats = useSelector(GetFPSStats);
  const renderTimeStats = useSelector(GetRenderTimeStats);

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
        <div className={styles.Shoot} onTouchStart={shootRequest}>
          <div className={styles.Filler} ref={shootFiller}></div>
          <i className="fas fa-meteor"></i>
        </div>
        <div className={styles.Jump} onTouchStart={jumpRequest}>
          <i className="fas fa-angle-double-up"></i>
        </div>
      </div>
      <div className={styles.Stats} onTouchStart={toggleStats}>
        <i className="fas fa-info-circle"></i>
        <div
          className={`${styles.StatsList} ${
            !showStats && styles.HideStatsList
          }`}
        >
          <Stats
            width={200}
            height={100}
            label={"Memory"}
            maxValueNum={10}
            maxValue={80}
            values={memoryStats}
          />
          <Stats
            width={200}
            height={100}
            label={"FPS"}
            maxValueNum={10}
            maxValue={60}
            values={fpsStats}
          />
          <Stats
            width={200}
            height={100}
            label={"Render t."}
            maxValueNum={10}
            maxValue={40}
            values={renderTimeStats}
          />
        </div>
      </div>
    </div>
  );
};

export default GameUi;
