/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import axios from "axios"
import { useState, useEffect } from "react";

export default function Header(){
  const [name, setName] = useState<string | null>(null);
  //const [isLoading, setIsLoading] = useState(true);

  const checkLoginStatus = async() => {
    try{
      const response = await axios.get("http://localhost:3000/logged_in_user", 
      {withCredentials: true});
      if(response.data.name != null){
        setName(response.data.name);
      } else {
        setName("")
      }
      //setIsLoading(false)
    }catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    checkLoginStatus()
  },[])  
    
  return(
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">Portfolio</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">ホーム</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`/${name}`}>プロフィール</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`/post/${name}`}>自分の投稿</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`/post`}>みんなの投稿</a>
            </li>
            <li>
              <a className="nav-link" href={`/post/new`}>新規投稿</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}