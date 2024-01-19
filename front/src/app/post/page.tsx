"use client";
import UserWork from "../../components/UserWork";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";
import style from "./page.module.css";

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

  useGetCsrfToken().then((token) => {
    if (token) {
      setToken(token);
    }
  });

  const getPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/posts");
      setPostData(response.data);
    } catch (e) {
      alert(e);
    }
  };
  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row">
          {postData.map((d, index) => {
            const thumbnail = d.images_url[0];
            return (
              <div className={`col-sm-12 col-md-6 col-lg-4 ${style.userWork}`}  key={index}>
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
