import React from "react";
import GoogleLogin from "react-google-login";

function App() {
  const responseGoogle = (response: any) => {
    console.log(response);
  };

  const failureGoogle = (response: any) => {
    console.log(response);
  };

  return (
    <div className="App">
      <GoogleLogin
          clientId="302169626863-c1d4af3h94s4ll4j3p9n46gam133soab.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={failureGoogle}
          cookiePolicy={"single_host_origin"}
      />
    </div>
  );
}

export default App;
