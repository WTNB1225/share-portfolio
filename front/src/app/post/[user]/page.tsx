/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import UserWork from "../../../../components/UserWork";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../../components/Header";

type Data = {
  images_url:string
  title:string,
  content:string,
  id:string,
  username:string
  avatar_url:string
}


export default function PostUser() {
  const [data, setData] = useState<Data[]>([]);
  const pathname = usePathname();
  const splitPathname = pathname.split("/");
  const name = splitPathname[splitPathname.length - 1];
  const [avatar, setAvatar] = useState("");

  const getUsersPosts = async(name:string) => {
    try{
      const response = await axios.get(`http://localhost:3000/posts/${name}`);
      console.log(response.data)
      setData(response.data)
    } catch(e){
      alert(e);
    }
  }

  const getUsersAvatar = async(name:string) => {
    try{
      const response = await axios.get(`http://localhost:3000/users/${name}`)
      setAvatar(response.data.avatar_url)
    } catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getUsersPosts(name);
    getUsersAvatar(name);
  },[]);

  return(
    <>
      <Header/>
      {data.map((d, index) => {
        const thumbnail = d.images_url[0];
        return(
          <UserWork key={index} title={d.title} id={d.id} name={d.username} image={thumbnail} avatar={d.avatar_url}/>
        )
      })}
    </>
  )
}