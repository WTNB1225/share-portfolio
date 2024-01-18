/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import axios from "axios";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { usePathname } from "next/navigation";
import Header from "../../../../components/Header";
import style from "./page.module.css";
import Image from "next/image";
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";
import Comment from "@/components/Comment";


const getPostById = async (id: string) => {
  try {
    const response = await axios.get(`http://localhost:3000/post/${id}`, {
      withCredentials: true,
    });
    const title = response.data.title;
    const content = response.data.content;
    const images_url = response.data.images_url;
    return { title, content, images_url };
  } catch (e) {
    alert(e);
  }
};

type Data = {
  user_id: string;
  post_id: string;
  content: string;
  avatar_url: string;
  name: string;
};

export default function PostId() {
  const pathname = usePathname();
  const splitpathname = pathname.split("/");
  const id = splitpathname[splitpathname.length - 1];
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [comments, setComments] = useState<Data[]>([]);
  const [commentLoading, setCommentLoading] = useState(true);
  const [userData, setUserData] = useState<Data[]>([]);
  //console.log(id)

  const getComment = async (id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/showPostComments/${id}`
      );
      if(response.data != null){
        const tmpData = [];
        for(let d of response.data){
          const response = await axios.get(`http://localhost:3000/user/${d.user_id}`);
          tmpData.push(response.data);
        }
        setUserData(tmpData);
      }
      console.log(response.data);
      setComments(response.data);
      setCommentLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  console.log(userData);

  useCheckLoginStatus().then((data) => {
    if (data) {
      setUserId(data.id);
    }
  });

  useGetCsrfToken().then((token) => {
    if (token) {
      setToken(token);
    }
  });

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("comment[content]", comment);
    formData.append("comment[post_id]", id);
    formData.append("comment[user_id]", userId);
    try {
      const response = await axios.post(
        "http://localhost:3000/comments",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRF-Token": token,
          },
        }
      );
      setComment("");
      getComment(id);
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getPostById(id).then((p) => {
      setTitle(p?.title);
      setContent(p?.content);
      setUrl(p?.images_url);
    });
    getComment(id);
  }, []);

  

  return (
    <>
      <Header />
      <div className="container">
  <h1 className={style.h1}>{title}</h1>
  <p className={style.content}>{content}</p>
  <div className={style.imageContainer}>
    <div className="row">
      {url.map((image, index) => (
        <div key={index} className={`col-6 ${style.img}`}>
          <Image
            alt=""
            src={image}
            width={400}
            height={300}
            layout="responsive"
          />
        </div>
      ))}
    </div>
  </div>
</div>
<div className="container">
  <div className="comment">
    <h3>コメント</h3>
    {comments.map((comment, index) => {
      return (
        <div className="row">
          <Comment
            key={index}
            content={comment.content}
            avatar={userData[index].avatar_url}
            username={userData[index].name}
          />
        </div>
      );
    })}
  </div>
</div>
{commentLoading == false && (
  <div className="row">
    <div className="col-12 col-md-10 offset-md-1">
      <form onSubmit={handleSubmit}>
        <label>
          <textarea className="form-control" value={comment} onChange={handleCommentChange}></textarea>
        </label>
        <button className="btn btn-primary mt-2" type="submit">送信</button>
      </form>
    </div>
  </div>
)}
    </>
  );
}
