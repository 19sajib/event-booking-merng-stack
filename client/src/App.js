import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import './App.css';

import Navigation from './components/Navigation/Navigation';
import Auth from './pages/Auth'
import Bookings from './pages/Bookings'
import Events from './pages/Events'

const App = () => {
  return (
    <BrowserRouter>
    <Navigation />
    <React.Fragment>
      <main className="main-content">
    <Switch>
      <Redirect from="/" to="/auth" exact />
    <Route path="/auth">
      <Auth />
    </Route>
    <Route path="/events" component={Events} />
    <Route path="/bookings" component={Bookings} />
    </Switch>
    </main>
    </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
