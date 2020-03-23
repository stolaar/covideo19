export const SOCKET_URL = "http://127.0.0.1:5000";

const socket_events = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  VERIFY_USER: "VERIFY_USER",
  USER_CONNECTED: "USER_CONNECTED",
  USER_DISCONNECTED: "USER_DISCONNECTED",
  CALL_USER: "CALL_USER",
  CALL_MADE: "CALL_MADE",
  MAKE_ANSWER: "MAKE_ANSWER",
  ANSWER_MADE: "ANSWER_MADE"
};

export default socket_events;