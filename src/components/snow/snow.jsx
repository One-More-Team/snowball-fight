import React from "react";

import styles from "./snow.module.scss";

const Snow = () => {
  const snowFlakes = (
    <>
      {Array.from({ length: 100 }, (_, i) => (
        <div className={styles.Snow} key={`snow-${i}`} />
      ))}
    </>
  );
  return <div className={styles.Wrapper}>{snowFlakes}</div>;
};

export default Snow;
