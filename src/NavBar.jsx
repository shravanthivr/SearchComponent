import React from 'react';
import { Link } from 'react-router-dom';
import "./NavBar.css";

const NavBar = () => {
return (
  <nav>
    <ul>
      <li><Link to="/">Blink Health</Link></li>
      <li><Link to="/">Search</Link></li>
      <li><Link to="/drugs/:name">Drug Details</Link></li>
    </ul>
  </nav>
);

}

export default NavBar;
