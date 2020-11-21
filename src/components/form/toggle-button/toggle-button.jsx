import React, { useState } from "react";

import styles from "./toggle-button.module.scss";

const ToggleButton = ({ onChange }) => {
  const [isActive, setIsActive] = useState(false);
  const toggle = () => {
    if (onChange) onChange(!isActive);
    setIsActive(!isActive);
  };

  return (
    <div className={styles.Wrapper} onClick={toggle}>
      <div
        className={`${styles.Marker} ${isActive && styles.ActiveMarker}`}
      ></div>
    </div>
  );
};

export default ToggleButton;
