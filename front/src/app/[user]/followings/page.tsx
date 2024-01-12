"use client";
import axios from "axios";
import Header from "../../../../components/Header";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Data = {
  id:string;
  name:string
}

export default function Followings() {
  const [data, setData] = useState<Data>();
  const [avatar, setAvatar] = useState("");

  const pathname = usePathname();
  const splitPathname = pathname.split("/");
  const username = splitPathname[splitPathname.length -2];
  const getFollowings = async(name:string) => {
    try{
      const response = await axios.get(`http://localhost:3000/followings/${name}`);
      setData(response.data)
    } catch(e) {
      console.log(e)
    }

    console.log(data)
    return data;
  }

  const getUsersAvatar = async(name:string) => {
    try{
      const response = await axios.get(`http://localhost:3000/users/${name}`)
      setAvatar(response.data.avatar_url)
      console.log(response.data)
    } catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getFollowings(username).then((d) => {
      if(d){
        console.log(d)
        getUsersAvatar(d.name);
      }
    })
  },[])

  return(
    <div>
      <Header/>

    </div>
  )
}