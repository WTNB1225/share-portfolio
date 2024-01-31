"use client";
import UserWork from "../../components/UserWork";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";
import style from "./page.module.css";
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";

type Data = {
  id: string;
  title: string;
  content: string;
  image: string;
  images_url: string;
  username: string;
  avatar_url: string;
};

export default function Post() {
  const [postData, setPostData] = useState<Data[]>([]);
  const [token, setToken] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(); //ログインしているかどうか
  const [loading, setLoading] = useState(true); //ログインユーザーの情報を取得するまでtrue
  const {data, isLoading} = useCheckLoginStatus(); //{data: ログインしたユーザーの情報, isLoading: data取得中かどうか}
  useEffect(() => {
    if(isLoading == false) {
      if(!data) {
        setLoggedIn(false)
      }
      setLoading(false);
    }
  },[data, isLoading])

  //CSRFトークンを取得するカスタムフック(いいね,ブックマークに使用)
  const csrfToken = useGetCsrfToken();
  useEffect(() => {
    setToken(csrfToken); 
  }, [csrfToken]);


  const getPosts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}/posts`);
      setPostData(response.data);
    } catch (e) {
      return;
    }
  };
  useEffect(() => {
    getPosts();
  }, []);

  if(loading) return;

  if(loggedIn == false) {
    return(
      <>
        <Header />
        <h1 className="text-center" style={{marginTop:"32px"}}>ログインしてください</h1>
      </>
    )
  }
  return (
    <div>
      <Header />
      <div className="container">
        <div className="row">
          {postData.map((d, index) => {
            const thumbnail = d.images_url[0];
            return (
              <div className={`col-sm-12 col-md-6 col-lg-4 ${style.userWork}`}  style={{marginTop:"32px"}} key={index}>
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
      </div>
    </div>
  );
}
