import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { GetPlayers } from '../../../store/selectors/websocket';
import styles from './summary.module.scss';

const Summary = () => {
  const [stat, setStat] = useState(false);
  const players = useSelector(GetPlayers);

  const onTouchStart = (e) => {
    console.log('start');
    setStat(() => true);
  };

  const onTouchEnd = (e) => {
    console.log('end');
    setStat(() => false);
  };

  return (
    <>
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={styles.statcontainer}
      >
        <i className={`fas fa-chart-pie ${styles.stat}`} />
      </div>
      {stat && (
        <div className={styles.wrapper}>
          <div className={`${styles.list}  ${styles['list-header']} `}>
            <div className={styles['list-name']}>
              <FormattedMessage id="stat-name" />
            </div>
            <div className={styles['list-data']}>
              <FormattedMessage id="stat-killed" />
            </div>
            <div className={styles['list-data']}>
              <FormattedMessage id="stat-death" />
            </div>
          </div>
          {players.map((data) => (
            <div key={data.id} className={styles.list}>
              <div className={styles['list-name']}>
                {data.userName}
              </div>
              <div className={styles['list-data']}>
                {data.kill}
              </div>
              <div className={styles['list-data']}>
                {data.die}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Summary;
