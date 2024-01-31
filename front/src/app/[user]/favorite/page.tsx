"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";
import { useUsersFavoriteState } from "@/hook/useUsersFavoriteState";
import Header from "@/components/Header";
import UserWork from "@/components/UserWork";
import style from "./page.module.css";
import axios from "axios";


export default function UsersFavorite() {
  const {
    name, setName,
    userId, setUserId,
    usernameLoading, setUsernameLoading,
    usernameId, setUsernameId,
    userLoading, setUserLoading,
    loading, setLoading,
    postId, setPostId,
    postData, setPostData,
    token, setToken
  } = useUsersFavoriteState(); //useStateを管理するカスタムフック

  const pathname = usePathname();
  const username = pathname.split("/").reverse()[1]; //URLからユーザー名を取得
  const [loggedIn, setLoggedIn] = useState<boolean>(); //ログインしているかどうか

  const {data, isLoading} = useCheckLoginStatus(); //{data: ログインしたユーザーの情報, isLoading: data取得中かどうか}
  useEffect(() => {
    if (isLoading == false) {
      if(data) {
        setUserId(data?.id!);
        setName(data?.name!);
      } else {
        setLoggedIn(false)
      }
      setUserLoading(false) //dataの取得完了
    }
  }, [data, isLoading]);

  useEffect(() => {
    //usernameのユーザーIDを取得する関数
    async function getUserId(username: string) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/users/${username}`
        );
        if (response.data) {
          setUsernameId(response.data.id);
        }
      } catch (e) {
        return;
      } finally {
        setUsernameLoading(false);//ユーザーIDの取得完了
      }
    }
    getUserId(username);
  },[username])

  const csrfToken = useGetCsrfToken(); //CSRFトークンを取得するカスタムフック
  useEffect(() => {
    setToken(csrfToken);
    setLoading(false);
  }, [csrfToken]);

  useEffect(() => {
    //usernameがした投稿を取得する関数
    async function getFavorite() {
      if(usernameId == "") return; //usennameIdが取得できていない場合はreturn
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/${usernameId}/favorites`
        );
        if (response.data) {
          setPostId(response.data);
          const postDataTemp = [];
          for (const d of response.data) {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_ENDPOINT}/post/${d.post_id}`
            );
            postDataTemp.push(response.data);
          }
          setPostData(postDataTemp);
        }
      } catch (e) {
        return;
      }
    }
    getFavorite();
  }, [usernameId]);

  //全てのデータを読み込んでからレンダリングする
  if (loading || userLoading || usernameLoading) {
    return;
  }

  if(loggedIn == false) {
    return(
      <>
        <Header />
        <h1 className="text-center" style={{marginTop:"32px"}}>ログインしてください</h1>
      </>
    )
  }

  if(loading == false &&  userLoading == false && usernameLoading == false && usernameId == ""){ 
    return (
      <div>
          <Header />
          <h1 className="text-center" style={{marginTop:"32px"}}>このユーザーは存在しません</h1>
      </div>
    );
  }

  return (
    <>
        <Header />
        <div className="container">
          <div className="row">
          <h1 className="text-center" style={{marginTop:"32px"}}>{username}のいいね一覧</h1>
          {postData.map((d, index) => {
            const thumbnail = d.images_url[0];
            return (
              <div className={`col-sm-12 col-md-6 col-lg-4 ${style.userWork}`} style={{marginTop:"8px"}} key={index}>
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
    </>
  );
}
