import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfileStateSelector,
  getUserStateSelector,
} from "../redux/reducers/user";
import userAction, {
  loginFromGoogle,
  setCurrentUser,
} from "../redux/actions/user";
import * as propTypes from "prop-types";
import { useHistory } from "react-router-dom";
import React from "react";
import { is_empty } from "svelte/internal";

import "./accountLogin.css";


const AccountLogin = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(getUserStateSelector);
  const profile = useSelector(getProfileStateSelector);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) =>
      dispatch(userAction.setCurrentUser(codeResponse)),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          dispatch(userAction.loginFromGoogle(res.data));
          history.push("/blockly-home");
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const logOut = () => {
    googleLogout();
    dispatch(userAction.loginFromGoogle(null));
  };

  return (
<div className="container">
    <div className="card">
        <h2>Navgurukul-Arduino Playground Google Login Version 2</h2>
        {profile && !is_empty(profile) ? (
            <div>
                <img src={profile.picture} alt="user image" />
                <h3>User Logged in</h3>
                <p>Name: {profile.name}</p>
                <p>Email Address: {profile.email}</p>
                <button className="logoutButton" onClick={logOut}>Log out</button>
            </div>
        ) : (
            <button className="google-signin-btn" onClick={() => login()}>Sign in with Google 🚀</button>
        )}
    </div>
</div>
  );
};

AccountLogin.prototype = {
  user: propTypes.array,
  profile: propTypes.array,
};

AccountLogin.defaultProps = {
  user: null,
  profile: null,
};

export default AccountLogin;
