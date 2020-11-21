import React from "react";

import styles from "./avatar.module.scss";

const Avatar = ({ photoUrl }) => (
  <div className={styles.Wrapper}>
    <img src={photoUrl} alt="avatar" />
  </div>
);

export default Avatar;
