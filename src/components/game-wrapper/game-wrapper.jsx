import React from 'react';
import GameUi from '../../game/game-ui';
import Summary from './summary/summary';

// import styles from "./game-wrapper.module.scss";

const GameWrapper = () => {
  let isWorldCreated = false;

  if (!isWorldCreated) {
    isWorldCreated = true;
    setTimeout(() => {
      window.createWorld({
        serverCall: () => console.log,
        userName: 'Krisz',
        onReady: () => {
          console.log('CREATED!');
        },
      });
    }, 1000);
  }

  return (
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
};

export default GameWrapper;
