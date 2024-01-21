/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import axios from "axios"
import { useState, useEffect } from "react";

export default function Header(){
  const [name, setName] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
  const [loading, setLoading] = useState(true);

  const checkLoginStatus = async() => {
    try{
      const response = await axios.get("http://localhost:3000/logged_in_user", 
      {withCredentials: true});
      if(response.data != null){
        setIsLoggedIn(true);
        setName(response.data.name);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    }catch(e) {
      setLoading(false);
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
              <a className="nav-link active" aria-current="page" href="/home">ホーム</a>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <a className="nav-link" href={`/${name}`}>プロフィール</a>
              </li>
            )}
            <li className="nav-item">
              <a className="nav-link" href={`/post`}>タイムライン</a>
            </li>
            <li>
              <a className="nav-link" href={`/post/new`}>新規投稿</a>
            </li>
            {
              loading == false &&
              <li className="nav-item">
                <a className="nav-link" href={isLoggedIn ? `/logout` : '/login'}>
                {isLoggedIn ? "ログアウト" : "ログイン"}
                </a>
              </li>
          }
          </ul>
        </div>
      </div>
    </nav>
  )
}