import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter
} from "react-router-dom";
import Preview from "./pages/Preview/index";


export default function BasicExample() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Preview/>}>
          </Route>
      </Routes>
    </BrowserRouter>  
  );
}

