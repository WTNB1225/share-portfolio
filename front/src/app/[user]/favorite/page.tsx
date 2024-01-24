"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";
import Header from "@/components/Header";
import UserWork from "@/components/UserWork";
import style from "./page.module.css"
import axios from "axios";

type Data = {
  id: string;
  title: string;
  content: string;
  image: string;
  images_url: string;
  username: string;
  avatar_url: string;
  post_id: string;
};

export default function UsersFavorite() {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState<boolean>();
  const [postId, setPostId] = useState<Data[]>([]);
  const [postData, setPostData] = useState<Data[]>([]);
  const [token, setToken] = useState(""); 
  
  const pathname = usePathname();
  const username = pathname.split("/").reverse()[1]

  useCheckLoginStatus().then((data) => {
    if (data) {
      setName(data.name);
      setUserId(data.id);
    } else{
      setUserId("");
    }
    setLoading(false);
  });
  

  useGetCsrfToken().then((token) => {
    if (token) {
      setToken(token);
    }
  });


  useEffect(() => {
    async function getFavorite() {
      try {
        const response = await axios.get(
          `http://localhost:3000/${userId}/favorites`
        );
        if(response.data){
          setPostId(response.data);
          const postDataTemp = [];
          for (const d of response.data) {
            const response = await axios.get(`http://localhost:3000/post/${d.post_id}`);
            postDataTemp.push(response.data);
          }
          setPostData(postDataTemp);
        }
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    }
    if(userId){
      getFavorite();
    }
  },[userId]);
  return (
  <div>
    <Header />
    {loading === false && (
      <div>
        {username === 'guest' ? (
          <p>ログインしてください</p>
        ) : (
          <>
            <h1>{username}のいいね一覧</h1>
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
          </>
        )}
      </div>
    )}
  </div>
);
}