/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import Link from "next/link";
import style from "@/styles/UserWork.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";
import { FaHeart } from "react-icons/fa";
export default function UserWork({
  id,
  name,
  title,
  image,
  avatar,
  token,
}: {
  id: string;
  name: string;
  title: string;
  image: string;
  avatar: string;
  token: string;
}) {
  const [currentUserId, setCurrentUserId] = useState("");
  const [amountOfLikes, setAmountOfLikes] = useState<number | undefined>();
  const [isLiked, setIsLiked] = useState<boolean>();

  useCheckLoginStatus().then((data) => {
    if (data) {
      setCurrentUserId(data.id);
    }
  });

  const getAmountOfLikes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/favorites_count/${id}`
      );
      setAmountOfLikes(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const isFavorite = async () => {
    try{
      const response = await axios.get(`http://localhost:3000/isFavorites/${currentUserId}/${id}`);
      console.log(response)
      if(response.data == true){
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    getAmountOfLikes();
    if(currentUserId) {
      isFavorite();
    }
  }, [currentUserId]);

  const handleLike = async () => {
    const formData = new FormData();
    formData.append("favorite[user_id]", currentUserId);
    formData.append("favorite[post_id]", id);

    try {
      const response = await axios.post(
        "http://localhost:3000/favorites",
        formData,
        {
          headers: {
            "X-CSRF-Token": token,
          },
        }
      );
      console.log(response);
      setIsLiked(true);
      getAmountOfLikes();
    } catch (e) {
      console.log(e);
    }
  };

  const handleUnLike = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/favorites/${currentUserId}/${id}`,
        {
          headers: {
            "X-CSRF-Token": token,
          },
        }
      );
      console.log(response);
      setIsLiked(false);
      getAmountOfLikes();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    amountOfLikes !== undefined && (
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
        {isLiked ? (
          <button onClick={handleUnLike} className={style.icon}>
            <FaHeart color="red" size={30} />
          </button>
        ) : (
          <button className={style.icon} onClick={handleLike}>
            <FaHeart color="gray" size={30}/>
          </button>
        )}
        <h3>{amountOfLikes} likes</h3>
      </div>
    )
  );
}
