import React, { useState, useRef } from "react";

import axios from "axios";

import RoomIcon from '@material-ui/icons/Room';
import CancelIcon from '@material-ui/icons/Cancel';

import "./Login.css";

export default function Login({ setShowLogin, setCurrentUsername, myStorage }) {

  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post("/users/login", user);
      setCurrentUsername(res.data.username);
      myStorage.setItem("user", res.data.username);
      setShowLogin(false)
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <RoomIcon className="logoIcon" />
        <span>React-Travel-Map</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={usernameRef} />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
        />
        <button className="loginBtn" type="submit">
          Login
        </button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <CancelIcon className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}