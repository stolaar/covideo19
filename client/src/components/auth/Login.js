import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { useHistory } from "react-router";

function Login({ login, error, isAuth }) {
  const [nickname, setNickname] = useState("");
  const history = useHistory();

  const onChange = e => {
    setNickname(e.target.value);
  };

  const onSubmit = e => {
    e.preventDefault();
    login(nickname);
  };

  useEffect(() => {
    if (isAuth) history.push("/streaming");
  }, [isAuth, history]);

  return (
    <div className="row mx-auto justify-content-center h-100">
      <div className="col-7 my-auto text-center justify-content-center">
        <h2>Login</h2>
        <form onSubmit={onSubmit}>
          <input
            className={classnames("form-control", { "is-invalid": error })}
            placeholder="Enter nickname"
            name="nickname"
            onChange={onChange}
          />
          <small className="invalid-feedback">{error}</small>
          <button type="submit" className="btn btn-primary btn-block mt-2">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
