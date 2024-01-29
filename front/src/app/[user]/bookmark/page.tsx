"use client";
import axios from "axios";
import {useEffect} from "react";
import Header from "@/components/Header";
import style from "./page.module.css";
import { usePathname } from "next/navigation";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";  //CSRFトークンを取得するカスタムフック
import { useBookmarkState } from "@/hook/useBookmarkState"; //useStateを管理するカスタムフック
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus"; //ログイン状態を取得するカスタムフック
import UserWork from "@/components/UserWork";


export default function Bookmark() {
  const { name, setName, loading, setLoading, token, setToken, postData, setPostData } = useBookmarkState(); 
  const pathname = usePathname();//現在のURLを取得
  const username = pathname?.split("/").reverse()[1]; //URLからユーザー名を取得


  const {data, isLoading} = useCheckLoginStatus(); //{data: ログインしたユーザーの情報, isLoading: data取得中かどうか}
  
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

  useEffect(() => {
    if(isLoading == false) {
      setName(data?.name!);
      if(data) {
        getBookmark(data.id); //ブックマークした投稿を取得
      }
      setLoading(false); //dataの取得完了
    }
  },[data, isLoading])


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