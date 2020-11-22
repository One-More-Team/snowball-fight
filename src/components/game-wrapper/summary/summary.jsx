import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { GetPlayers } from '../../../store/selectors/websocket';
import styles from './summary.module.scss';

const Summary = () => {
  const players = useSelector(GetPlayers);

  return (

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
  );
};

export default Summary;
