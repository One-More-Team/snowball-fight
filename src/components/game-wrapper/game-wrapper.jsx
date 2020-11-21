import React from 'react';
import GameUi from '../../game/game-ui';
import Summary from './summary/summary';

// import styles from "./game-wrapper.module.scss";

const GameWrapper = () => (
  <div>
    <canvas
      id="canvas"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
      }}
    />
    <GameUi />
    <Summary />
  </div>
);

export default GameWrapper;
