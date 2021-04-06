import React, { useEffect } from "react";
import socket from "./connect-socket";
import GoogleLogin from "react-google-login";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connect");
    });
    socket.emit(
      "authorization",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxNzc0NDY5NSwiZXhwIjoxNjE3NzQ1ODk1fQ.pnEbnC3zZulSYQVxYghTf_wEDEjA_Pv44IQPXSthafo"
    );

    socket.on("authorization", function (data: any) {
      console.log("on", data);
    });

    socket.on("UPDATE:LIST", (id: string) => {
      console.log("List");

      console.log(id);
      socket.emit("ROOM:ADD-TO-LIST", id);
    });
  }, []);

  const responseGoogle = (response: any) => {
    console.log(response);
  };

  return (
    <>
      <GoogleLogin
        clientId="843111139337-uksj44ivbjjlt0hvuitj8inegvkglgu9.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />
      <button
        onClick={() => {
          socket.emit("ROOM:CREATE", { title: "Among Ass" });
        }}
      >
        create room
      </button>
      <button
        onClick={() => {
          socket.emit("ROOM:LIVE", { title: "Among Ass" });
        }}
      >
        room live
      </button>
    </>
  );
}

export default App;
