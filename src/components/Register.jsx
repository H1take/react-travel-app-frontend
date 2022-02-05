import React, { useState, useRef } from "react";

import axios from "axios";

import RoomIcon from '@material-ui/icons/Room';
import CancelIcon from '@material-ui/icons/Cancel';

import "./Register.css";

export default function Register ({ setShowRegister }) {

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = {
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
          };
      
          try {
            await axios.post("/users/register", newUser);
            setError(false);
            setSuccess(true);
          } catch (err) {
            setError(true);
          }
        };

    return(
        <div className="registerContainer">
            <div className="logo">
                <RoomIcon />
                React-Travel-Map
            </div>
            <form onSubmit={handleSubmit}>
                <input autoFocus type="text" placeholder="username" ref={usernameRef} />
                <input type="email" placeholder="Email" ref={emailRef} />
                <input type="password" min="6" placeholder="Password" ref={passwordRef} />
                <button className="registerBtn">Register</button>
                {success && <span className="success">Successfull. You can login now!</span>}
                {error && <span className="failure">Something went wrong!</span>}
            </form>
            <CancelIcon
                className="registerCancel"
                onClick={() => setShowRegister(false)}
            />
        </div>
    );
};