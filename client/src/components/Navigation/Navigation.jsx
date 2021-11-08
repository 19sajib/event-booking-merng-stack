import React from 'react'
import { NavLink } from 'react-router-dom';

import './Navigation.css'

const Navigation = () => {
    return (
        <header className="main-navigation">
    <div className="main-navigation__logo">
      <h1>Event Booking</h1>
    </div>
    <nav className="main-navigation__items">
      <ul>
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        <li>
          <NavLink to="/bookings">Bookings</NavLink>
        </li>
      </ul>
    </nav>
  </header>
    )
}

export default Navigation