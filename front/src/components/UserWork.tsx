import Image from "next/image";
import Link from "next/link";
import style from "@/styles/UserWork.module.css";
import { useEffect, useState } from "react";
import axios from "axios";


export default function UserWork({
  id,
  name,
  title,
  image,
  avatar,
  token
}: {
  id: string;
  name: string;
  title: string;
  image: string;
  avatar: string;
  token: string;
}) {


  const [likes, setLikes] = useState(true);
  const [nowLikes, setNowLikes] = useState("");

  useEffect(() => {
    const getLikes = async () => {
      try{
        const response = await axios.get(`http://localhost:3000/post/${id}`)
        setNowLikes(response.data.like)
        console.log(response.data)
      } catch(e) {
        console.error(e);
      }
    }
    getLikes();
  }, [id]);

  const handleLike = async () => {
    const formData = new FormData();
    formData.append("post[like]", (parseInt(nowLikes.toString()) + 1).toString());
    try {
      const response = await axios.patch(`http://localhost:3000/posts/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRF-Token": token// ヘッダーにCSRFトークンを追加
          },
          withCredentials: true,
        }
      )
      console.log(response.data)
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={style.workContainer}>
      <Link className={style.user} href={`/${name}`}>
        <Image
          className={style.img}
          src={avatar}
          width={40}
          height={40}
          alt="avatar"
        />
        <h3>{name}</h3>
      </Link>
      <Link href={`/post/${name}/${id}`}>
        <Image
          alt=""
          src={image}
          height={300}
          width={400}
          layout="responsive"
          className={style.workImage}
        />
        <h2 className={style.workTitle}>{title}</h2>
      </Link>
      <button onClick={handleLike}>Like</button>
      <p>{nowLikes} likes</p>
    </div>
  );
}
