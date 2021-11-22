import React, { useContext } from "react";

import "./Auth.css"

import AuthContext from "../context/auth-context";

const Auth = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const { login } = useContext(AuthContext);
  const emailRef = React.useRef();
  const passwordRef = React.useRef();

  const swicthModeHandler = () => {
    setIsLoggedIn((prevState) => {
      return !prevState;
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
          query Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              userId
              token
              tokenExpiration
            }
          }
        `,
      variables: {
        email: email,
        password: password
      }  
    };

    if (!isLoggedIn) {
      requestBody = {
        query: `
            mutation CreateUser($email: String!, $password: String!) {
              createUser(userInput: {email: $email, password: $password}) {
                _id
                email
              }
            }
          `,
        variables: {
            email: email,
            password: password
          }    
      };
    }

    // API Call
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        if (resData.data.login.token) {
          login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="from-controll">
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" ref={emailRef} />
      </div>
      <div className="from-controll">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordRef} />
      </div>
      <div className="from-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={swicthModeHandler}>
          Switch to {isLoggedIn ? "Signup" : "Login"}
        </button>
      </div>
    </form>
  );
};

export default Auth;
