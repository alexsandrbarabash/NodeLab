import React, { useEffect, useState } from "react";
import socket from "./connect-socket";
import GoogleLogin from "react-google-login";

function App() {
  const [roomId, setRoomId] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connect");
    });
    socket.emit(
      "authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxNzgzNjIzNCwiZXhwIjoxNjE3ODM3NDM0fQ.sK3W6cjMMEES-FhM1biLU7Vn3q1orB0NtgG4hEoRGso"
    );

    socket.on("authorization", function (data: any) {
      console.log("on", data);
    });

    socket.on("UPDATE:LIST", (data: any) => {
      console.log("List");
      console.log(count);
      console.log(data.id);
      setCount((prev) => prev + 1);
      setRoomId(data.id);

      // socket.emit("ROOM:ADD-TO-LIST", data);
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
          socket.emit("ROOM:CREATE", { title: "Among Ass", typeRoom: "CHAT" });
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
      <button
        onClick={() => {
          socket.emit("ROOM:DELETE", roomId);
        }}
      >
        delete live
      </button>
    </>
  );
}

export default App;
