import React, { useRef } from "react";

import styles from "./touch-controller.module.scss";

const TOUCH_STICK_AREA_RADIUS = 75;

const TouchController = ({ reportPercentages }) => {
  const isDragged = useRef(false);
  const area = useRef();
  const stickArea = useRef();
  const stick = useRef();

  const setStickPosition = ({ x, y }) => {
    let left = x;
    let top = y;
    const leftOffset = Number(stickArea.current.style.left.replace("px", ""));
    const topOffset = Number(stickArea.current.style.top.replace("px", ""));

    const distance = Math.sqrt(
      Math.pow(left - leftOffset, 2) + Math.pow(top - topOffset, 2)
    );
    if (distance > TOUCH_STICK_AREA_RADIUS) {
      const angle = Math.atan2(top - topOffset, left - leftOffset);

      left = leftOffset + TOUCH_STICK_AREA_RADIUS * Math.cos(angle);
      top = topOffset + TOUCH_STICK_AREA_RADIUS * Math.sin(angle);
    }

    if (reportPercentages) {
      const xDistance = leftOffset - left;
      const yDistance = topOffset - top;
      reportPercentages({
        x: xDistance / TOUCH_STICK_AREA_RADIUS,
        y: yDistance / TOUCH_STICK_AREA_RADIUS,
      });
    }

    stick.current.style.left = `${left}px`;
    stick.current.style.top = `${top}px`;
  };

  const onTouchStart = (e) => {
    // It's not a real array, there is no find on it
    let touch;
    for (let i = 0; i < e.targetTouches.length; i++) {
      const { target } = e.targetTouches[i];
      if (
        target === area.current ||
        target === stickArea.current ||
        target === stick.current
      ) {
        touch = e.targetTouches[i];
      }
    }
    if (touch) {
      stickArea.current.style.left = `${touch.clientX}px`;
      stickArea.current.style.top = `${touch.clientY}px`;
      stickArea.current.className += ` ${styles.Active}`;
      stick.current.className += ` ${styles.Active}`;
      setStickPosition({ x: touch.clientX, y: touch.clientY });
    }
    isDragged.current = true;
  };

  const onTouchEnd = (e) => {
    if (isDragged.current) {
      isDragged.current = false;
      stickArea.current.className = stickArea.current.className.replace(
        ` ${styles.Active}`,
        ""
      );
      stick.current.className = stick.current.className.replace(
        ` ${styles.Active}`,
        ""
      );

      if (reportPercentages) {
        reportPercentages({
          x: 0,
          y: 0,
        });
      }
    }
  };

  const onTouchMove = (e) => {
    if (isDragged.current) {
      // It's not a real array, there is no find on it
      let touch;
      for (let i = 0; i < e.targetTouches.length; i++) {
        const { target } = e.targetTouches[i];
        if (
          target === area.current ||
          target === stickArea.current ||
          target === stick.current
        ) {
          touch = e.targetTouches[i];
        }
      }
      if (touch) {
        setStickPosition({ x: touch.clientX, y: touch.clientY });
      }
    }
  };

  return (
    <div
      className={styles.Wrapper}
      ref={area}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
    >
      <div className={styles.StickArea} ref={stickArea}></div>
      <div className={styles.Stick} ref={stick}></div>
    </div>
  );
};

export default TouchController;
