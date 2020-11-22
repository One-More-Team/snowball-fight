import React, { useEffect, useState } from "react";

import styles from "./toggle-button.module.scss";

const ToggleButton = ({ onChange, externalValue }) => {
  const [isActive, setIsActive] = useState(externalValue || false);
  const toggle = () => {
    if (onChange) onChange(!isActive);
    setIsActive(!isActive);
  };

  useEffect(() => {
    setIsActive(externalValue);
  }, [externalValue]);

  return (
    <div className={styles.Wrapper} onTouchStart={toggle}>
      <div
        className={`${styles.Marker} ${isActive && styles.ActiveMarker}`}
      ></div>
    </div>
  );
};

export default ToggleButton;
