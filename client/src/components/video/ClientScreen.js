import React from "react";

function ClientScreen({ clientRef, onClick, isOn, nickname }) {
  return (
    <div
      style={{
        border: "1px solid #d3d3d3",
        position: "absolute",
        width: "300px",
        height: "300px",
        right: "2em",
        bottom: "2em",
        zIndex: "2",
        background: "white"
      }}
      className="p-2"
    >
      {nickname}
      <span
        onClick={onClick}
        style={{
          cursor: "pointer",
          float: "right",
          color: isOn ? "red" : "gray"
        }}
        className="text-right pr-2"
      >
        <i className="fas fa-camera"></i>
      </span>
      <video
        ref={clientRef}
        autoPlay
        muted
        className="local-video"
        id="local-video"
      ></video>
    </div>
  );
}

export default ClientScreen;
