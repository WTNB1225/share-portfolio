/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import axios from "axios"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Header from "../../../../../components/Header"
import style from "./page.module.css"
import Image from "next/image"

const getPostById = async(id:string) => {
  try{
    const response = await axios.get(`http://localhost:3000/post/${id}`,{withCredentials:true});
    const title = response.data.title;
    const content = response.data.content;
    const images_url = response.data.images_url;
    return {title, content, images_url}
  } catch(e){
    alert(e);
  }
}

export default function PostId() {
  const pathname = usePathname();
  const splitpathname = pathname.split("/");
  const id = splitpathname[splitpathname.length - 1];
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState<string[]>([]);
  //console.log(id)


  useEffect(() => {
    getPostById(id).then((p) => {
      setTitle(p?.title);
      setContent(p?.content);
      setUrl(p?.images_url);
    })
  },[]);

  return (
    <>
      <Header />
      <div className={style.postContainer}>
        <h1 className={style.h1}>{title}</h1>
        <p className={style.content}>{content}</p>
        <div className={style.imageContainer}>
          {url.map((image, index) => (
            <div key={index} className={style.img}>
              <Image alt="" src={image} width={400} height={300}  layout="responsive"/>
            </div>
          ))}
        </div>
      </div>
    </>
  );
  
}