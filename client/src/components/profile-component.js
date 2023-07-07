import React from "react";

const Profilecomponent = (props) => {
  let { currentUser } = props;

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>You must login first before getting your profile.</div>
      )}
      {currentUser && (
        <div>
          <h1>in profile page.</h1>
          <header className="jumbotron">
            <h3>
              <strong>{currentUser.user.username}</strong>
            </h3>
          </header>
          <p>
            <strong>Token: {currentUser.token}</strong>
          </p>
          <p>
            <strong>Token: {currentUser.user._id}</strong>
          </p>
          <p>
            <strong>Token: {currentUser.user.email}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default Profilecomponent;
