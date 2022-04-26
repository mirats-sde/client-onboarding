import React from "react";
import styles from "./loader.module.css";
function Loader() {
  return (
    <div className={styles.spans}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

export default Loader;
