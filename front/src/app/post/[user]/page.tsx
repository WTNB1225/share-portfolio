/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import UserWork from "../../../components/UserWork";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";
import style from "./page.module.css";

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
  const pathname = usePathname();
  const splitPathname = pathname.split("/");
  const [avatar, setAvatar] = useState("");
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const name = splitPathname[splitPathname.length - 1];

  const csrfToken = useGetCsrfToken();
  useEffect(() => {
    setToken(csrfToken); 
  }, [csrfToken]);


  const getUsersPosts = async (name: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/posts/${name}`);
      setData(response.data);
      setLoading(false);
    } catch (e) {
      return;
    }
  };

  const getUsersAvatar = async (name: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${name}`);
      setAvatar(response.data.avatar_url);
    } catch (e) {
      return;
    }
  };

  useEffect(() => {
    getUsersPosts(name);
    getUsersAvatar(name);
  }, []);

  if(loading) {
    return;
  }

  if(data.length === 0 && loading == false) {
    return(
      <>
      <Header/>
      <div className="d-flex justify-content-center">
        <h2 style={{marginTop: "32px"}}>ユーザーが存在しません</h2>
      </div>
      </>
    )
  } else {
    return (
      <>
        <Header />
        <div className="container">
          <div className="row">
          {data.map((d, index) => {
            const thumbnail = d.images_url[0];
            return (
              <div className={`col-12 col-md-6 col-lg-4 ${style.userWork}`} style={{marginTop:"32px"}} key={index}>
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
    );
  }
}
