import React, { useEffect } from "react";
import socket from "./connect-socket";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connect");
    });
    socket.emit(
      "authorization",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImlhdCI6MTYxNjUyMDU3NH0.AsQNinGnwgtSjnEJnftaSgBLCND9Zv6L7pv7Klgfwaw"
    );

    socket.on("authorization", function (data: any) {
      console.log("on", data);
      socket.emit("findAllChat", 12);
    });

    socket.on("findAllChat", (data: any) => {
      console.log(data);
    });
  }, []);

  return <></>;
}

export default App;
