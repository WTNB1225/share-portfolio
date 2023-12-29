/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import axios from "axios"
import { useState, useEffect } from "react";

export default function Header(){
  const [name, setName] = useState("");

  const checkLoginStatus = async() => {
    try{
      const response = await axios.get("http://localhost:3000/logged_in_user", 
      {withCredentials: true});
      if(response.data.name != null){
        setName(response.data.name);
      } else {
        setName("guest")
      }
    }catch(e) {
      console.log(e);
    }
  }

    useEffect(() => {
      checkLoginStatus()
    },[]);
    
  return(
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Navbar w/ text</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`/${name}`}>User</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="">Pricing</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}