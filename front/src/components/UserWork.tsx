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
import Cookies from "js-cookie"; 

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
  const [theme, setTheme] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookieTheme = Cookies.get("theme");
    setTheme(cookieTheme || "#F8F9FA");
  },[theme])

  const {data, isLoading} = useCheckLoginStatus();
  useEffect(() => {
    if (isLoading == false) {
      setCurrentUserId(data?.id!);
    }
  }, [data, isLoading]);

  const checkBookmark = async () => {
    try{
      const response = await axios.get(`http://localhost:3000/isBookmarked/${currentUserId}/${id}`);
      if(response.data == true){
        setIsBookmarked(true);
      } else {
        setIsBookmarked(false);
      }
    } catch(e){
      return;
    }
  }

  const handleBookmark = async () => {
    if(!currentUserId) {
      alert("ログインしてください")
    }
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
      return;
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
      setIsBookmarked(false);
      checkBookmark()
    } catch (e) {
      return;
    }
  };

  

  const getAmountOfLikes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/favorites_count/${id}`
      );
      setAmountOfLikes(response.data);
      setLoading(false)
    } catch (e) {
      return;
    }
  };


  const isFavorite = async () => {
    try{
      const response = await axios.get(`http://localhost:3000/isFavorites/${currentUserId}/${id}`);
      if(response.data == true){
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } catch(e){
      return;
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
    if(!currentUserId) {
      alert("ログインしてください")
    }
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
      return;
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
      setIsLiked(false);
      getAmountOfLikes();
    } catch (e) {
      return;
    }
  };

  if(loading) {
    return;
  }

  return (
    loading == false &&
      <div className={`${style.workContainer}`}>
        <Link className={`${style.user} ${style.center}`} href={`/${name}`} >
          <Image
            className={style.img}
            src={avatar}
            width={40}
            height={40}
            alt="avatar"
          />
          <h3 style={{color: theme == "#F8F9FA" ? "black" : "white", textDecoration:"none" }}>{name}</h3>
        </Link>
        <Link href={`/post/${name}/${id}`} style={{textDecoration:"none"}}>
          <Image
            alt=""
            src={image}
            height={250}
            width={250}
            layout="responsive"
            style={{marginTop:"8px"}}
            className={style.workImage}
          />
          <h2 className={style.overflow} style={{color: theme == "#F8F9FA" ? "black" : "white", textDecoration:"none"}}>{title}</h2>
        </Link>
        {isLiked ? (
          <button onClick={handleUnLike} className={style.icon} style={{background:"none"}}>
            <FontAwesomeIcon icon={faHeartSolid} color="red" size="xl"/>
          </button>
        ) : (
          <button className={style.icon} onClick={handleLike} style={{background:"none"}}>
            <FontAwesomeIcon icon={faHartRegular} size="xl"/>
          </button>
        )}
        {isBookmarked ? (
          <button onClick={handleUnBookmark} className={style.bookmark} style={{background:"none"}}>
            <FontAwesomeIcon icon={faBookmarkSolid} color="skyblue" size="xl"/>
          </button>
        ) : (
          <button className={style.icon} onClick={handleBookmark} style={{background:"none"}}>
            <FontAwesomeIcon icon={faBookmarkRegular} size="xl"/>
          </button>
        )}
        <h3 style={{color: theme == "#F8F9FA" ? "black" : "white" }}>{amountOfLikes} likes</h3>
      </div>
    )
}
