import React from "react";

import GameUi from "../../game/game-ui";
import Summary from "./summary/summary";
import Loader from "../spinner/loader";

import styles from "./game-wrapper.module.scss";

const GameWrapper = () => (
  <div className={styles.Wrapper}>
    <canvas
      id="canvas"
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        left: 0,
        top: 0,
      }}
    />
    <GameUi />
    <Summary />
    <div className={styles.Loader}>
      <Loader /> loading in progress...
    </div>
  </div>
);

export default GameWrapper;
