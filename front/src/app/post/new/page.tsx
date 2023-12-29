"use client";

import axios from "axios";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../../components/Header";

export default function PostNew() {
  const router = useRouter()
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true); 

  const checkLoginStatus = async() => {
    try{
      const response = await axios.get("http://localhost:3000/logged_in_user", {withCredentials: true});
      setId(response.data.id)
      setName(response.data.name)
      setLoading(false);
    } catch(e){
      console.log(e)
      setLoading(false)
    }
  }

  const handleTitleChange = (e:ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleContentChange = (e:ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
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
          },
        }
      );
      router.push("/post");
    } catch (error) {
      
    }
  }

  useEffect(() => {
    checkLoginStatus();
  },[])


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
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input type="text" onChange={handleTitleChange}/>
          </label>
          <label>
            Content
            <textarea onChange={handleContentChange}/>
          </label>
          <label>
            Image
            <input type="file" multiple accept="image/jpeg,image/gif,image/png"onChange={handleFileChange} />
          </label>
          <button type="submit">投稿</button>
        </form>
      ) : (
        <div>
          <h1>401 Unauthorized</h1>
        </div>
      )}
    </div>
    </>
  )
}

