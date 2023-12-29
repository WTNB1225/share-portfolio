"use client";
import UserWork from "../../../components/UserWork";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";

type Data = {
  id:string
  title:string
  content:string
  image:string
  images_url:string
  username:string
}

export default function Post() {
  const router = useRouter();
  const [postData, setPostData] = useState<Data[]>([]);
  const getPosts = async() => {
    try{
      const response = await axios.get("http://localhost:3000/posts");
      setPostData(response.data)
    } catch(e){
      alert(e);
    }
  }
  useEffect(() => {
    getPosts();
  },[]);


  return(
    <>
      <Header/>
      {postData.map((d, index) => {
        const thumbnail = d.images_url[0];
        return(
          <UserWork key={index} title={d.title} id={d.id} name={d.username} image={thumbnail} />
        )
      })}
    </>
  )
}