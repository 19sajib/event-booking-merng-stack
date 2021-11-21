import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";

import Navigation from "./components/Navigation/Navigation";
import Auth from "./pages/Auth";
import Bookings from "./pages/Bookings";
import Events from "./pages/Events";
import AuthContext from "./context/auth-context";

const App = () => {
  const [token, setToken] = React.useState(null);
  const [userId, setUserId] = React.useState(null);

  const login = (token, userId, tokenExpiration) => {
    setUserId(userId);
    setToken(token);
  };
  console.log(token, userId);
  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider
          value={{ userId: userId, token: token, login: login, logout: logout }}
        >
          <Navigation />
          <main className="main-content">
            <Switch>
              {token && <Redirect from="/" to="/events" exact />}
              {token && <Redirect from="/auth" to="/events" exact />}
              <Route path="/auth">
                <Auth />
              </Route>
              <Route path="/events" component={Events} />
              {token && <Route path="/bookings" component={Bookings} />}
              {!token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
};

export default App;
