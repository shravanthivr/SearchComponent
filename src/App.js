import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './NavBar';
import Search from './component/Search';
import SearchDetails from './component/SearchDetails';

function App() {
     
  return (
      <Router>
        <NavBar/>
        <Routes>
        <Route path="/" element={<Search/>} />
        <Route path="/drugs/:name/:rxcui/:synonym" element={<SearchDetails />} />
        </Routes>
      </Router>
  );
}

export default App;
