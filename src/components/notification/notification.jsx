import React from "react";
import { useSelector } from "react-redux";
import { GetActiveNotification } from "../../store/selectors/notification";

import styles from "./notification.module.scss";

const Notification = () => {
  const activeNotification = useSelector(GetActiveNotification);

  return (
    <div className={styles.Wrapper}>
      <div className={`${styles.Bubble} ${activeNotification && styles.Show}`}>
        <i className="fas fa-exclamation-circle"></i>
        {activeNotification}
      </div>
    </div>
  );
};

export default Notification;
