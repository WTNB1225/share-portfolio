"use client";
import axios from "axios";
import { use, useEffect, useState } from "react";
import Header from "@/components/Header";
import style from "./page.module.css";
import { useRouter, usePathname } from "next/navigation";
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";
import { get } from "http";

type Data = {
  name:string;
  id: string;
  title: string;
  content: string;
  image: string;
  images_url: string;
  username: string;
  avatar_url: string;
  post_id: string;
};

export default function Bookmark() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Data>({name:"", id:"", title:"", content:"", image:"", images_url:"", username:"", avatar_url:"", post_id:""});

  const pathname = usePathname();
  const username = pathname.split("/").reverse()[1];

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const response = await axios.get("http://localhost:3000/logged_in_user", {
          withCredentials: true,
        });
        setData(response.data);
        getBookmark(response.data.id); 
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
  
    async function getBookmark(id: string) { 
      try{
        const response = await axios.get(`http://localhost:3000/${id}/bookmarks`);
        console.log(response.data);
      } catch(e) {
        console.log(e);
      }
    }
  
    checkLoginStatus();
  }, []); 

  if(loading == false) {
    if(data.name !== username){
      return (
        <div>
          <Header />
          <h1>ブックマーク</h1>
          <h1>あなたはこのページを見ることはできません</h1>
        </div>
      )
    }
  }
  
  return (
    loading == false &&(
    <div>
      <Header />
      <h1>ブックマーク</h1>

    </div>
    )
  );
  
}
