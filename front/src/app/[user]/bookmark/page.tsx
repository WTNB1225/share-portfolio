"use client";
import axios from "axios";
import { use, useEffect, useState } from "react";
import Header from "@/components/Header";
import style from "./page.module.css";
import { useRouter, usePathname } from "next/navigation";
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";
import UserWork from "@/components/UserWork";

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
  const [data, setData] = useState<Data[]>([]);
  const [token, setToken] = useState("");
  const [postData, setPostData] = useState<Data[]>([]);

  const pathname = usePathname();
  const username = pathname.split("/").reverse()[1];

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const response = await axios.get("http://localhost:3000/logged_in_user", {
          withCredentials: true,
        });
        setName(response.data.name);
        getBookmark(response.data.id); 
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
    
  
    async function getBookmark(id: string) { 
      try{
        const response = await axios.get(`http://localhost:3000/${id}/bookmarks`);
        const tmpData = [];
        for(let d of response.data) {
          const response = await axios.get(`http://localhost:3000/post/${d.post_id}`);
          tmpData.push(response.data);
        }
        setPostData(tmpData);
      } catch(e) {
        console.log(e);
      }
    }
  
    checkLoginStatus();
  }, []); 


  useGetCsrfToken().then((token) => {
    if (token) {
      setToken(token);
    }
  });

  // ログインしていない場合
  if(loading == false) {
    if(name !== username){
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
      {postData.map((d, index) => {
        const thumbnail = d.images_url[0];
        return (
          <div className={`${style.posts}`} key={index}>
            <UserWork
              key={index}
              title={d.title}
              id={d.id}
              name={d.username}
              image={thumbnail}
              avatar={d.avatar_url}
              token={token}
            />
          </div>
        );
      })}
    </div>
    )
  );
  
}
