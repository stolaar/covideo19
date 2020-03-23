import React, { useEffect } from "react";
import { useHistory } from "react-router";

function Landing({ isAuth }) {
  const history = useHistory();

  useEffect(() => {
    if (isAuth) {
      history.push("/streaming");
    }
  }, [isAuth, history]);

  return (
    <div className="row justify-content-center mx-auto">
      <div className="col-8 text-center">
        <h2>FACETIME FOR HARD TIMES</h2>
        <button
          onClick={() => history.push("/login")}
          className="btn btn-primary"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Landing;
