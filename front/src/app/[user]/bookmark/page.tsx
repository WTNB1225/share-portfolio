"use client";
import axios from "axios";
import {useEffect} from "react";
import Header from "@/components/Header";
import style from "./page.module.css";
import { usePathname } from "next/navigation";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";  //CSRFトークンを取得するカスタムフック
import { useBookmarkState } from "@/hook/useBookmarkState"; //useStateを管理するカスタムフック
import UserWork from "@/components/UserWork";


export default function Bookmark() {
  const { name, setName, loading, setLoading, token, setToken, postData, setPostData } = useBookmarkState(); 
  const pathname = usePathname();//現在のURLを取得
  const username = pathname?.split("/").reverse()[1]; //URLからユーザー名を取得


  useEffect(() => {;
    //ログインしているかどうかを確認する関数
    async function checkLoginStatus() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}/logged_in_user`, {
          withCredentials: true,
        });
        setName(response.data.name); //ログインしているユーザー名を取得
        getBookmark(response.data.id); //ブックマークした投稿を取得
      } catch (e) {
        return;
      } finally {
        setLoading(false);
      }
    }
    
  
    //ブックマークした投稿を取得する関数
    async function getBookmark(id: string) { 
      try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}/${id}/bookmarks`); //userのbookmarkを取得
        const tmpData = [];
        for(let d of response.data) {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}/post/${d.post_id}`); //bookmarkの配列をループして投稿を取得
          tmpData.push(response.data); 
        }
        setPostData(tmpData);
      } catch(e) {
        return;
      }
    }
    checkLoginStatus();
  }, [setLoading, setName, setPostData]); 


  const csrfToken = useGetCsrfToken(); //CSRFトークンを取得するカスタムフック
  useEffect(() => {
    if (csrfToken) {
      setToken(csrfToken);
    }
  }, [csrfToken, setToken]);


  // ログインしていない場合
  if(loading == false) {
    if(name !== username){
      return (
        <div>
          <Header />
          <h1 className="text-center" style={{marginTop:"32px"}}>あなたはこのページを見ることはできません</h1>
        </div>
      )
    }
  }
  
  return (
    loading == false &&(
    <div>
      <Header />
      <h1 className="text-center" style={{marginTop:"32px"}}>ブックマーク</h1>
      <div className="container">
        <div className="row justify-content-center">
          {postData.map((d, index) => {
            const thumbnail = d.images_url[0];
            return (
              <div className={`col-12 col-sm-8 col-md-6 col-lg-4 ${style.posts}`} style={{marginTop:"8px"}} key={index}>
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
    )
  );
}
