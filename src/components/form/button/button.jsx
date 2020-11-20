import React, { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { GetSiteLanguageMessages } from "../../../store/selectors/site-language";

import styles from "./button.module.scss";

const ButtonStyle = {
  Primary: "Primary",
  Secondary: "Secondary",
  Tertiary: "Tertiary",
  Outline: "Outline",
};

const Button = ({
  label = "",
  messageId = null,
  onClick = null,
  style = null,
  iconPrefix = "fas",
  icon = "",
  isLoading = false,
  navigationTarget = null,
  className = null,
  children = null,
  autoWidth = true,
  isEnabled = true,
  selected = false,
}) => {
  const root = useRef();
  const container = useRef();
  const selectedLanguage = useSelector(GetSiteLanguageMessages);
  const history = useHistory();

  const onClickHandler = () => {
    if (navigationTarget !== null) history.push(navigationTarget);
    if (onClick) onClick();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (root.current && autoWidth) {
        root.current.style.width = "0px";
        root.current.style.width = `${
          container.current.getBoundingClientRect().width + 30 + 1
        }px`;
      }

      return () => clearTimeout(timer);
    }, 100);
  }, [messageId, label, selectedLanguage, autoWidth]);

  let styleClassName = "";
  switch (style) {
    case ButtonStyle.Primary:
      styleClassName = styles.PrimaryButton;
      break;
    case ButtonStyle.Secondary:
      styleClassName = styles.SecondaryButton;
      break;
    case ButtonStyle.Tertiary:
      styleClassName = styles.TertiaryButton;
      break;
    case ButtonStyle.Outline:
      styleClassName = styles.OutlineButton;
      break;
    default:
  }
  return (
    <div
      className={`${styleClassName} ${className} ${
        isLoading && styles.Loading
      } ${!isEnabled && styles.Disabled} ${selected ? styles.Selected : null}`}
      onClick={onClickHandler}
      ref={root}
    >
      <div ref={container}>
        {icon && (
          <i
            className={`${iconPrefix} ${icon} ${
              (messageId || label) && styles.IconMargin
            }`}
          ></i>
        )}
        {messageId === null ? label : <FormattedMessage id={messageId} />}
        {children}
      </div>
    </div>
  );
};

export { ButtonStyle };
export default Button;
