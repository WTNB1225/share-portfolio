"use client";
import axios from "axios";
import Header from "../../../../components/Header";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Followers() {
  const pathname = usePathname();
  const splitPathname = pathname.split("/");
  const username = splitPathname[splitPathname.length -2];
  const getFollowers = async(name:string) => {
    try{
      const response = await axios.get(`http://localhost:3000/followers/${name}`);
      console.log(response)

    } catch(e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getFollowers(username);
  })

  return(
    <div>
      <Header/>

    </div>
  )
}