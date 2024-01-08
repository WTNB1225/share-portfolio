/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import axios, { AxiosResponse } from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Image from "next/image";
import style from "./page.module.css"
import UserWork from "../../../components/UserWork";

type Data = {
  images_url:string
  title:string,
  content:string,
  id:string,
  username:string
}

export default function User() {
  const [data, setData] = useState<Data[]>([])
  const [userData, setUserData] = useState<AxiosResponse>();
  const pathname = usePathname();
  const splitpath = pathname.split("/");
  const username = splitpath[splitpath.length - 1];
  const [name, setName] = useState("");
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
  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/${username}`
      );
      setName(response.data.name);
      setAvatar(response.data.avatar_url);
    } catch (e) {
      //console.log(e);
    }
  };
  const checkLoginStatus = async () => {
    try {
      const response = await axios.get("http://localhost:3000/logged_in_user", {
        withCredentials: true,
      });
      if (response.data.name != null) {
        setUserData(response);
      } else {
        setName("guest");
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    getUserInfo();
    getUsersPosts(username)
  }, []);

  return (
    <>
      <Header />
      <div className={style.avatar}>
        <Image className={style.img} src={avatar} width={80} height={80} alt="avatar"/>
        <h1>{name}</h1>
      </div>
      {data.map((d, index) => {
        const thumbnail = d.images_url[0];
        return(
          <UserWork key={index} title={d.title} id={d.id} name={d.username} image={thumbnail} avatar={avatar}/>
        )
      })}
    </>
  );
}
