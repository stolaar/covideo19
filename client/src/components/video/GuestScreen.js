import React from "react";

function GuestScreen({ guestRef }) {
  return (
    <div
      style={{
        border: "1px solid #d3d3d3",
        width: "100%",
        height: "100%",
        minHeight: "100%",
        background: "lightgray"
      }}
      className="col-12 text-left"
    >
      Guest screen
      <video
        ref={guestRef}
        autoPlay
        className="remote-video"
        id="remote-video"
      ></video>
    </div>
  );
}

export default GuestScreen;
