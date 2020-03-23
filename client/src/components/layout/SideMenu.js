import React, { useState, useEffect } from "react";
import SOCKET_EVENTS from "../config/socket_events";
import "./Layout.css";

const { USER_DISCONNECTED, USER_CONNECTED } = SOCKET_EVENTS;

function SideMenu({ socket, onGuestClick }) {
  const [users, setUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on(USER_CONNECTED, data => {
        if (users) setUsers(data);
      });

      socket.on(USER_DISCONNECTED, data => {
        if (users) setUsers(data);
      });
    }
  }, [socket, users]);

  useEffect(() => {
    if (users) {
      let list = Object.keys(users).map(key => (
        <li
          onClick={() => onGuestClick(users[key].socketId)}
          key={users[key].socketId}
          className="user-item"
        >
          {users[key].name}
        </li>
      ));
      setUsersList(list);
    }
  }, [users, onGuestClick]);
  return (
    <div
      style={{
        borderRight: "1px solid #d3d3d3",
        height: "100%",
        minHeight: "100%",
        maxHeight: "100%"
      }}
      className="col-2"
    >
      <h2 className="mb-2">Users</h2>
      <div className="row mx-auto">
        <div className="col-12 text-center justify-content-center">
          <ul className="users-list text-center justify-content-center">
            {usersList}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
