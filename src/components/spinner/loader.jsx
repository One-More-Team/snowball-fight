import React from "react";

import styles from "./loader.module.scss";

const Loader = ({ className = "" }) => (
  <i className={`fas fa-cog ${styles.Loader} ${className}`} />
);

export default Loader;
