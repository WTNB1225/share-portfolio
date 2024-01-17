/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import Link from "next/link";
import style from "@/styles/UserWork.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import {faBookmark as faBookmarkSolid} from "@fortawesome/free-solid-svg-icons"
import {faHeart as faHartRegular} from "@fortawesome/free-regular-svg-icons"
import {faHeart as faHeartSolid} from "@fortawesome/free-solid-svg-icons"

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
  const [isBookmarked, setIsBookmarked] = useState<boolean | undefined>();


  useCheckLoginStatus().then((data) => {
    if (data) {
      setCurrentUserId(data.id);
    }
  });

  const checkBookmark = async () => {
    try{
      const response = await axios.get(`http://localhost:3000/isBookmarked/${currentUserId}/${id}`);
      if(response.data == true){
        setIsBookmarked(true);
      } else {
        setIsBookmarked(false);
      }
    } catch(e){
      console.log(e)
    }
  }

  const handleBookmark = async () => {
    const formData = new FormData();
    formData.append("bookmark[user_id]", currentUserId);
    formData.append("bookmark[post_id]", id);
    try{
      const response = await axios.post(
        "http://localhost:3000/bookmarks",
        formData,
        {
          headers:{
            "X-CSRF-Token": token,
          },
          withCredentials: true,
        }
      )
      setIsBookmarked(true);
      checkBookmark();
    } catch(e){
      console.log(e)
    }
  }

  const handleUnBookmark = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/bookmarks/${currentUserId}/${id}`,
        {
          headers: {
            "X-CSRF-Token": token,
          },
        }
      );
      console.log(response);
      setIsBookmarked(false);
      checkBookmark()
    } catch (e) {
      console.log(e);
    }
  };

  

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
      checkBookmark();
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
    amountOfLikes !== undefined  && isBookmarked !== undefined && (
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
            <FontAwesomeIcon icon={faHeartSolid} color="red" size="xl"/>
          </button>
        ) : (
          <button className={style.icon} onClick={handleLike}>
            <FontAwesomeIcon icon={faHartRegular} size="xl"/>
          </button>
        )}
        {isBookmarked ? (
          <button onClick={handleUnBookmark} className={style.bookmark}>
            <FontAwesomeIcon icon={faBookmarkSolid} color="skyblue" size="xl"/>
          </button>
        ) : (
          <button className={style.icon} onClick={handleBookmark}>
            <FontAwesomeIcon icon={faBookmarkRegular} size="xl"/>
          </button>
        )}
        <h3>{amountOfLikes} likes</h3>
      </div>
    )
  );
}
