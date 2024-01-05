/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import axios, { AxiosResponse } from "axios";
import { usePathname } from "next/navigation";
import {useEffect, useState} from "react";
import Header from "../../../components/Header";


export default function User() {
  const [userData, setUserData] = useState<AxiosResponse>();
  const pathname = usePathname();
  const splitpath = pathname.split("/");
  const username = splitpath[splitpath.length - 1]
  const [name, setName] = useState("");
  const getUserInfo = async() => {
    try{
      const response = await axios.get(`http://localhost:3000/users/${username}`);
      console.log(response.data.name)
      setName(response.data.name)
    } catch(e){
      //console.log(e);
    }
  }
  const checkLoginStatus = async() => {
    try{
      const response = await axios.get("http://localhost:3000/logged_in_user", 
      {withCredentials: true});
      if(response.data.name != null){
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
      <Header/>
      <h1>{name}</h1>
    </>
  )
}