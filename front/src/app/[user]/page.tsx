/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import axios, { AxiosResponse } from "axios";
import { usePathname } from "next/navigation";
import {useEffect, useState} from "react";


export default function User() {
  const [userData, setUserData] = useState<AxiosResponse>();
  const pathname = usePathname();
  const splitpath = pathname.split("/");
  const username = splitpath[splitpath.length - 1]
  //console.log(username)
  const [name, setName] = useState<string>("");
  const getUserInfo = async() => {
    try{
      const response = await axios.get(`http://localhost:3000/users/${username}`);
      //console.log(response);
    } catch(e){
      //console.log(e);
    }
  }
  const checkLoginStatus = async() => {
    try{
      const response = await axios.get("http://localhost:3000/logged_in_user", 
      {withCredentials: true});
      if(response.data.name != null){
        setName(response.data.name);
        setUserData(response);
      } else {
        setName("guest")
      }
    }catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    checkLoginStatus();
    getUserInfo();
  },[]);

  return(
    <>
      <h1>{username}</h1>
    </>
  )
}