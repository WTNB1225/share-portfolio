/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import axios from "axios"
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Cookies from "js-cookie";


export default function Header(){
  const [name, setName] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
  const [avatar, setAvatar] = useState<string>("");
  const [theme, setTheme] = useState(Cookies.get("theme") || "light");
  const checkLoginStatus = async() => {
    try{
      const response = await axios.get("http://localhost:3000/logged_in_user", 
      {withCredentials: true});
      if(response.data != null){
        setIsLoggedIn(true);
        setName(response.data.name);
        setAvatar(response.data.avatar_url);
      } else {
        setIsLoggedIn(false);
      }
    }catch(e) {
      return;
    }
  }

  const handleThemeChange = () => {
    if(theme == "light" || theme == ""){
      setTheme("dark");
      Cookies.set("theme", "dark");
    } else {
      setTheme("light");
      Cookies.set("theme", "light");
    }
  }

  useEffect(() => {
  },[theme])

  useEffect(() => {
    checkLoginStatus()
  },[])  
    
  return(
    <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{background:theme}}>
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
        <li className="nav-item">
          <a className="nav-link" href={`/post`}>タイムライン</a>
        </li>
        <li>
          <a className="nav-link" href={`/post/new`}>新規投稿</a>
        </li>
      </ul>
      {isLoggedIn && (
        <div className="dropdown">
          <button type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style={{background: "none", border: "none"}}>
            <Image src={avatar} width={40} height={40} alt="" style={{borderRadius:"50%"}}/>
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li><a className="dropdown-item" href={`/${name}`}>プロフィール</a></li>
            <li><a className="dropdown-item" href={`/logout`}>ログアウト</a></li>
            <li><a className="dropdown-item" onClick={handleThemeChange}>色の変更</a></li>
          </ul>
        </div>
      )}
    </div>
  </div>
</nav>
  )
}