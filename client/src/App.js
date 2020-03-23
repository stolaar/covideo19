import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import VideoContainers from "./components/video/Containers";
import Header from "./components/layout/Header";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import sockerIOClient from "socket.io-client";
import SocketEvents, { SOCKET_URL } from "./components/config/socket_events";
import Login from "./components/auth/Login";
import Landing from "./components/layout/Landing";
import isEmpty from "lodash.isempty";

const { VERIFY_USER } = SocketEvents;

function App() {
  const [user, setUser] = useState("");
  const [userError, setError] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = sockerIOClient(SOCKET_URL);
    socket.on("client_connected", data => {
      console.log(data);
    });
    setSocket(socket);
  }, []);

  const onVerify = ({ user, isUser }) => {
    if (isUser) {
      setError("Nickname taken");
    } else {
      setError("");
      setUser(user);
    }
  };

  const loginUser = nickname => {
    if (nickname && socket) {
      socket.emit(VERIFY_USER, nickname, onVerify);
    }
  };

  return (
    <Fragment>
      <Header />
      <div className="container-fluid">
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={() => <Landing isAuth={!isEmpty(user)} />}
            />
            <Route
              exact
              path="/login"
              render={() => (
                <Login
                  isAuth={!isEmpty(user)}
                  error={userError}
                  login={loginUser}
                />
              )}
            />
            <Route
              exact
              paht="/streaming"
              render={() => <VideoContainers socket={socket} user={user} />}
            />
            <Redirect to="/" />
          </Switch>
        </Router>
      </div>
    </Fragment>
  );
}

export default App;
