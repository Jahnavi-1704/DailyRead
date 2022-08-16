import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Article from "./components/Article";
import SavedArticles from "./components/savedArticles";

function App() {

  return (
      <div>
          <Router>
              <Routes>
                  <Route path="/" element={<Landing />} exact/>
                  <Route path="/profile" element={<Profile />} exact/>
                  <Route path="/dashboard" element={<Dashboard />} exact />
                  <Route path="/article" element={<Article />} exact />
                  <Route path="/saved" element={<SavedArticles />} exact />
              </Routes>
          </Router>
      </div>
  );
}

export default App;
