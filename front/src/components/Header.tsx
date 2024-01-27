/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import axios from "axios"
import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import style from "@/styles/Header.module.css"
import { useWindowWidth } from "@/hook/useWindowWidth";

export default function Header(){
  const [name, setName] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
  const [avatar, setAvatar] = useState<string>("");
  const [theme, setTheme] = useState(Cookies.get("theme") || "#F8F9FA"); //cookieに保存されていなければデフォルトは白
  const [width, setWidth] = useState(0);
  //ログイン状態を確認する関数
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
        setTheme("#F8F9FA"); //ログインしていない場合はテーマを白にする
      }
    }catch(e) {
      return;
    }
  }

  //レスポンシブのため, ウィンドウの幅を取得 カスタムフック
  const windowWidth = useWindowWidth();
  useEffect(() => {
    setWidth(windowWidth);
  }, [windowWidth]);

  //テーマの変更
  const handleThemeChange = () => {
    if(theme == "#F8F9FA" || theme == ""){
      setTheme("#1a1a1a");
      Cookies.set("theme", "#1d2020");
    } else {
      setTheme("#F8F9FA");
      Cookies.set("theme", "#F8F9FA");
    }
  }

  

  useEffect(() => {
    checkLoginStatus()
  },[]);

  return(
    <nav className={`navbar navbar-expand-lg ${style.maxHeight} ${style.dropdownLargeScreen}`} style={{background:theme}}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/" style={{color: theme === "#F8F9FA" ? "black" : "white"}}>Portfolio</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation" style={{backgroundColor: theme == "#F8F9FA" ? "F8F9FA" : "#2F3232"}}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/home" style={{color: theme === "#F8F9FA" ? "black" : "white"}}>ホーム</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`/post`} style={{color: theme === "#F8F9FA" ? "black" : "white"}}>タイムライン</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`/post/new`} style={{color: theme === "#F8F9FA" ? "black" : "white"}}>新規投稿</a>
            </li>
          </ul>
          {isLoggedIn && (
            <div className={`dropdown ms-auto`}>
            {width < 1024 && (
              <>
                <button type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style={{background: "none", border: "none"}}>
                  <Image src={avatar} width={40} height={40} alt="" style={{borderRadius:"50%"}}/>
                </button>
                <ul className={`dropdown-menu dropdown-memu-end ${style.hover}`} aria-labelledby="dropdownMenuButton" style={{background:theme}}>
                  <li><a className={`dropdown-item`} href={`/${name}`} style={{color: theme === "#F8F9FA" ? "black" : "white"}}>プロフィール</a></li>
                  <li><a className="dropdown-item" href={`/logout`} style={{color: theme === "#F8F9FA" ? "black" : "white"}}>ログアウト</a></li>
                  <li onClick={handleThemeChange}><a href={`/${name}`} className="dropdown-item" style={{color: theme === "#F8F9FA" ? "black" : "white"}}>色の変更</a></li>
                </ul>
              </>  
            )}
            {width >= 1024 && (
              <>
                <button type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style={{background: "none", border: "none", position:"static"}}>
                  <Image src={avatar} width={40} height={40} alt="" style={{borderRadius:"50%", position:"static"}}/>
                </button>
                <ul className={`dropdown-menu dropdown-memu-end ${style.hover}`} aria-labelledby="dropdownMenuButton" style={{background:theme,transform: "translateX(-60%)"}}>
                  <li><a className="dropdown-item" href={`/${name}`} style={{color: theme === "#F8F9FA" ? "black" : "white"}}>プロフィール</a></li>
                  <li><a className="dropdown-item" href={`/logout`} style={{color: theme === "#F8F9FA" ? "black" : "white"}}>ログアウト</a></li>
                  <li onClick={handleThemeChange}><a href={`/${name}`} className="dropdown-item" style={{color: theme === "#F8F9FA" ? "black" : "white"}}>色の変更</a></li>
                </ul>
              </>  
            )}
          </div>
          )}
        </div>
      </div>
    </nav>
  )
}