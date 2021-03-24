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

  const responseGoogle = (response: any) => {
    console.log(response);
  };

  return (
    <>
      <GoogleLogin
        clientId="302169626863-c1d4af3h94s4ll4j3p9n46gam133soab.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />
    </>
  );
}

export default App;
