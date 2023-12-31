"use client";
import { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../../../components/Header';

export default function App() {
  const [name, setName] = useState("");
  const checkLoginStatus = async() => {
    try{
      const response = await axios.get("http://localhost:3000/logged_in_user", 
      {withCredentials: true});
      console.log(response.data.name);
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
    <>
      <Header/>
      <h1>Hello {name}</h1>
    </>
  )
}