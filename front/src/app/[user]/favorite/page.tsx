"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";
import Header from "@/components/Header";
import UserWork from "@/components/UserWork";
import style from "./page.module.css";
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
  const [userId, setUserId] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [postId, setPostId] = useState<Data[]>([]);
  const [postData, setPostData] = useState<Data[]>([]);
  const [token, setToken] = useState("");

  const pathname = usePathname();
  const username = pathname.split("/").reverse()[1];

  const {data, isLoading} = useCheckLoginStatus();
  useEffect(() => {
    if (isLoading == false) {
      setUserId(data?.id!);
      setName(data?.name!);
      setUserLoading(false);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setUserId(data.id);
      setUserLoading(false);
    }
  })
  

  useEffect(() => {
    async function getUserId(username: string) {
      try {
        const response = await axios.get(
          `http://localhost:3000/users/${username}`
        );
        if (response.data) {
          setName(response.data.name);
          setUserId(response.data.id);
        }
        setUserLoading(false);
      } catch (e) {
        return;
      }
    }
    getUserId(username);
  },[username])

  const csrfToken = useGetCsrfToken();
  useEffect(() => {
    setToken(csrfToken);
    setLoading(false);
  }, [csrfToken]);

  useEffect(() => {
    async function getFavorite() {
      try {
        const response = await axios.get(
          `http://localhost:3000/${userId}/favorites`
        );
        if (response.data) {
          setPostId(response.data);
          const postDataTemp = [];
          for (const d of response.data) {
            const response = await axios.get(
              `http://localhost:3000/post/${d.post_id}`
            );
            postDataTemp.push(response.data);
          }
          setPostData(postDataTemp);
        }
      } catch (e) {
        return;
      }
    }
    if (userId) {
      getFavorite();
    }
  }, [userId]);

  if (loading || userLoading) {
    return;
  }

  if ((loading == userLoading) == false && name == "") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center w-100">
          <Header />
          <p>ログインしてください</p>
        </div>
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
