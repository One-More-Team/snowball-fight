import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { signOutRequest } from "../../../../store/actions/auth";
import { GetUser } from "../../../../store/selectors/auth";
import Button, { ButtonStyle } from "../../../form/button/button";

import styles from "./profile.module.scss";

const Profile = ({ close }) => {
  const dispatch = useDispatch();
  const user = useSelector(GetUser);

  const signOut = () => dispatch(signOutRequest());

  return (
    <>
      <h1>
        <i className="fas fa-user"></i> Hello{" "}
        <span className={styles.Name}>{user.displayName}</span>
      </h1>
      <div className={styles.Actions}>
        <div className={styles.Action}>
          <Button
            messageId="sign-out"
            icon="fa-sign-out-alt"
            style={ButtonStyle.Secondary}
            onClick={signOut}
            autoWidth={false}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;
