import React, { useState, useEffect, useRef, useCallback } from "react";
import GuestScreen from "./GuestScreen";
import ClientScreen from "./ClientScreen";
import SOCKET_EVENTS from "../config/socket_events";
import SideMenu from "../layout/SideMenu";
import { useHistory } from "react-router";
import isEmpty from "lodash.isempty";
const { RTCPeerConnection, RTCSessionDescription } = window;
const peerConnection = new RTCPeerConnection();

const {
  LOGOUT,
  USER_CONNECTED,
  CALL_USER,
  CALL_MADE,
  MAKE_ANSWER,
  ANSWER_MADE
} = SOCKET_EVENTS;

function VideoContainers(props) {
  const clientRef = useRef();
  const guestRef = useRef();
  const [showCamera, setShowCamera] = useState(false);
  const [clientStream, setClientStream] = useState(null);
  const [isAlreadyCalling, setIsAlreadyCalling] = useState(true);
  const [guestUser, setGuest] = useState({});

  const { user, socket } = props;
  const history = useHistory();

  const onGuestClick = useCallback(
    async id => {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(
        new RTCSessionDescription(offer)
      );

      socket &&
        socket.emit(CALL_USER, {
          offer,
          to: id
        });
    },
    [socket]
  );

  useEffect(() => {
    if (!showCamera) {
      if (clientRef.current) {
        clientRef.current.srcObject = null;
      }
    } else if (showCamera && clientRef.current)
      navigator.getUserMedia(
        { video: true, audio: true },
        stream => {
          clientRef.current.srcObject = stream;
          setClientStream(stream);
          stream
            .getTracks()
            .forEach(track => peerConnection.addTrack(track, stream));
        },
        error => {
          console.warn(error.message);
        }
      );
  }, [showCamera, clientRef]);

  useEffect(() => {
    if (!showCamera) {
      clientStream && clientStream.getTracks().forEach(track => track.stop());
    }
  }, [showCamera, clientStream]);

  useEffect(() => {
    if (user) {
      socket && socket.emit(USER_CONNECTED, user);
    } else {
      history.push("/login");
    }
    return () => {
      socket && socket.emit(LOGOUT);
    };
  }, [user, socket, history]);

  useEffect(() => {
    if (socket) {
      socket.on(CALL_MADE, async data => {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(
          new RTCSessionDescription(answer)
        );

        socket.emit(MAKE_ANSWER, {
          answer,
          to: data.socket
        });
      });

      socket.on(ANSWER_MADE, async data => {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
        data.user && setGuest(data.user);
        if (!isAlreadyCalling) {
          onGuestClick(data.socket);
          setIsAlreadyCalling(true);
        }
      });
    }
  }, [socket, onGuestClick, isAlreadyCalling]);

  useEffect(() => {
    if (guestRef.current) {
      peerConnection.ontrack = function({ streams: [stream] }) {
        guestRef.current.srcObject = stream;
      };
    }
  }, [guestRef]);

  const onClientClick = () => {
    setShowCamera(!showCamera);
  };

  return (
    <div className="row">
      <SideMenu socket={socket} onGuestClick={onGuestClick} />
      <div className="col-10">
        {!isEmpty(guestUser) ? <h2>Talking with: {guestUser.name}</h2> : null}
        <div className="row">
          <GuestScreen guestRef={guestRef} />
          <ClientScreen
            nickname={user.name}
            isOn={showCamera}
            onClick={onClientClick}
            clientRef={clientRef}
          />
        </div>
      </div>
    </div>
  );
}

export default VideoContainers;
