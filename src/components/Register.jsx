import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "../api/axios";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";

const Register = () => {
  const usernameRef = useRef();
  const errorRef = useRef();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPwd, setConfirmPwd] = useState("");
  const [validConfirmPwd, setValidConfirmPwd] = useState(false);
  const [confirmPwdFocus, setConfirmPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(username);
    setValidUsername(result);
  }, [username]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    const isMatch = password === confirmPwd;
    setValidPassword(result);
    setValidConfirmPwd(isMatch);
  }, [password, confirmPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [username, password, confirmPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // in case button is enabled with JS hack
    const validateUsername = USER_REGEX.test(username);
    const validatePwd = PWD_REGEX.test(password);
    if (!validateUsername || !validatePwd) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      console.log(response.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);
      // clear input elements
      return;
    } catch (err) {
      if (!err.response) {
        setErrMsg("Server did not respond");
      } else if (err.response?.status === 409) {
        setErrMsg("Username already in use");
      } else {
        setErrMsg("Registration unsuccessful");
      }
      errorRef.current.focus();
    }
  };

  return (
    <section>
      <p
        ref={errorRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        {/* Username input */}
        <label htmlFor="username">
          Username:
          <span className={validUsername ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validUsername || !username ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <input
          type="text"
          id="username"
          ref={usernameRef}
          autoComplete="off"
          onChange={(e) => setUsername(e.target.value)}
          required
          aria-invalid={validUsername ? "false" : "true"}
          aria-describedby="uidnote"
          onFocus={() => setUsernameFocus(true)}
          onBlur={() => setUsernameFocus(false)}
        />
        <p
          id="uidnote"
          className={
            usernameFocus && username && !validUsername
              ? "instructions"
              : "offscreen"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          4 to 24 characters.
          <br />
          Must begin with a letter.
          <br />
          Letters, numbers, underscores and hyphens allowed.
        </p>
        {/* Password input */}
        <label htmlFor="password">
          Password:
          <span className={validPassword ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validPassword || !password ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-invalid={validPassword ? "false" : "true"}
          aria-describedby="pwdnote"
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
        />
        <p
          id="pwdnote"
          className={
            passwordFocus && !validPassword ? "instructions" : "offscreen"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          8 to 24 characters.
          <br />
          Must include uppercase and lowercase letters, a number and a special
          character.
          <br />
          Allowed special characters:{" "}
          <span aria-label="exclamation mark">!</span>{" "}
          <span aria-label="at symbol">@</span>{" "}
          <span aria-label="hashtag">#</span>{" "}
          <span aria-label="dollar sign">$</span>{" "}
          <span aria-label="percent">%</span>
        </p>
        {/* Password confirmation input */}
        <label htmlFor="confirm_pwd">
          Confirm password:
          <span className={validConfirmPwd && confirmPwd ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validConfirmPwd || !confirmPwd ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <input
          type="password"
          id="confirm_pwd"
          onChange={(e) => setConfirmPwd(e.target.value)}
          required
          aria-invalid={validConfirmPwd ? "false" : "true"}
          aria-describedby="confirmnote"
          onFocus={() => setConfirmPwdFocus(true)}
          onBlur={() => setConfirmPwdFocus(false)}
        />
        <p
          id="confirmnote"
          className={
            confirmPwdFocus && !validConfirmPwd ? "instructions" : "offscreen"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Must match the first password field.
        </p>
        <button
          disabled={
            !validUsername || !validPassword || !validConfirmPwd ? true : false
          }
        >
          Sign Up
        </button>
        <p>
          Already registered?
          <br />
          <span className="line">
            {/*put router link here*/}
            <a href="#">Sign In</a>
          </span>
        </p>
      </form>
    </section>
  );
};

export default Register;
