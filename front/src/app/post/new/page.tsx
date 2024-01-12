"use client";

import Image from "next/image";
import axios from "axios";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../../components/Header";
import style from "./page.module.css";
import { useCheckLoginStatus } from "../../../../hook/useCheckLoginStatus";
import { useGetCsrfToken } from "../../../../hook/useGetCsrfToken";

export default function PostNew() {
  const router = useRouter()
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true); 
  const [csrfToken, setCsrfToken] = useState(""); // CSRFトークンをstateに追加
  const [avatar, setAvatar] = useState("");

  useCheckLoginStatus().then(async (d) => {
    if(d){
      setId(d.id);
      setName(d.name)
      const res = await axios.get(`http://localhost:3000/users/${name}`);
      setAvatar(res.data.avatar_url);
      setLoading(false);
    }
  })


  useGetCsrfToken().then((token) => {
    if(token){
      setCsrfToken(token);
      setLoading(false);
    }
  });

  console.log(csrfToken)

  const handleTitleChange = (e:ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleContentChange = (e:ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    console.log(avatar)
  }

  const handleFileChange = (e:ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      setImages(Array.from(e.target.files));
    }
  }

  const handleSubmit = async(e:FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("post[title]", title);
    formData.append("post[content]", content);
    formData.append("post[user_id]", id);
    formData.append("post[username]",name);
    formData.append("post[avatar_url]", avatar)
    images.forEach((image) => {
      formData.append("post[images][]", image)
    })

    try {
      const response = await axios.post(
        "http://localhost:3000/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRF-Token": csrfToken, // ヘッダーにCSRFトークンを追加
          },
          withCredentials: true,
        }
      );
      console.log(response)
      router.push("/post");
    } catch (error) {
      alert(error);
    }
  }

  if (loading) {
    return (
      <></>
    )
  }

  return (
    <>
    <Header/>
    <div>
      {name ? (
        <form onSubmit={handleSubmit} className={`${style.form}`}>
          <label className={`${style.label}`}>
            Title
            <input className={`${style.width}`} type="text" onChange={handleTitleChange}/>
          </label>
          <label className={`${style.label}`}>
            Content
            <textarea className={`${style.width} ${style.height}`} onChange={handleContentChange}/>
          </label>
          <label className={`${style.label}`}>
            Image
            <input className={`${style.file}`} type="file" multiple accept="image/jpeg,image/gif,image/png"onChange={handleFileChange} />
          </label>
          <button type="submit">投稿</button>
        </form>
      ) : (
        <div>
          <h1>401 Unauthorized</h1>
        </div>
      )}
    </div>
    {images.map((image, index) => {
      const src = window.URL.createObjectURL(image)
      return(
        <Image key={index} src={src} alt="" width={200} height={150}/>
      )
    })}
    </>
  )
}