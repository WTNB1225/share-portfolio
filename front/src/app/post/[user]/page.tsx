/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import UserWork from "../../../components/UserWork";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";
import style from "./page.module.css";
import { set } from "react-hook-form";

type Data = {
  images_url: string;
  title: string;
  content: string;
  id: string;
  username: string;
  avatar_url: string;
};

export default function PostUser() {
  const [data, setData] = useState<Data[]>([]);
  const [avatar, setAvatar] = useState("");
  const [token, setToken] = useState<string>("");
  const [presence, setPresence] = useState<boolean>(); //ユーザーが存在するかどうか
  const [loadingPosts, setLoadingPosts] = useState(true); //投稿の取得中かどうか
  const [loadingAvatar, setLoadingAvatar] = useState(true); //ユーザーのアバターの取得中かどうか

  const pathname = usePathname();
  const name = pathname.split("/").reverse()[0]; //URLからユーザー名を取得

  //CSRFトークンを取得するカスタムフック
  const csrfToken = useGetCsrfToken();
  useEffect(() => {
    setToken(csrfToken);
  }, [csrfToken]);

  //nameのユーザーがいるかどうかを確認する関数
  const checkUser = async (name: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${name}`);
      if (response.data !== null) {
        setPresence(true);
      } else {
        setPresence(false);
      }
    } catch (e) {
      setPresence(false);
    }
  };

  //nameのユーザーの投稿を取得する関数
  const getUsersPosts = async (name: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/posts/${name}`);
      setData(response.data);
    } catch (e) {
    } finally {
      setLoadingPosts(false);
    }
  };

  //nameのユーザーのアバターを取得する関数
  const getUsersAvatar = async (name: string) => {
    setLoadingAvatar(true);
    try {
      const response = await axios.get(`http://localhost:3000/users/${name}`);
      setAvatar(response.data.avatar_url);
    } catch (e) {
    } finally {
      setLoadingAvatar(false);
    }
  };

  useEffect(() => {
    checkUser(name);
    getUsersPosts(name);
    getUsersAvatar(name);
  }, [name]);

  //loadingの定義
  const loading = loadingPosts || loadingAvatar;

  if (loading) {
    return;
  }

  //dataが空の場合かつpresenceがtrueの場合はユーザーは何も投稿していない
  if (data.length === 0 && presence) {
    return (
      <>
        <Header />
        <div className="d-flex justify-content-center">
          <h2 style={{ marginTop: "32px" }}>ユーザーは何も投稿していません</h2>
        </div>
      </>
    );
  } else if (data.length === 0 && !presence) {
    //dataが空の場合かつpresenceがfalseの場合はユーザーが存在しない
    return (
      <>
        <Header />
        <div className="d-flex justify-content-center">
          <h2 style={{ marginTop: "32px" }}>ユーザーが存在しません</h2>
        </div>
      </>
    );
  } else {
    return(
    <>
      <Header />
      <div className="container">
        <div className="row">
          {data.map((d, index) => {
            const thumbnail = d.images_url[0];
            return (
              <div
                className={`col-12 col-md-6 col-lg-4 ${style.userWork}`}
                style={{ marginTop: "32px" }}
                key={index}
              >
                <UserWork
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
    )
  }
}
