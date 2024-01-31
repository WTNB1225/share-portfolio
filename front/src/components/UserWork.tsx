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

  //テーマの設定
  useEffect(() => {
    const cookieTheme = Cookies.get("theme");
    setTheme(cookieTheme || "#F8F9FA");
  },[theme])

  const {data, isLoading} = useCheckLoginStatus(); //ログイン状態を確認するカスタムフック
  useEffect(() => {
    if (isLoading == false) {
      setCurrentUserId(data?.id!); //ログインしているユーザーのidを取得
    }
  }, [data, isLoading]);

  //ブックマークをすでにしているかを確認
  const checkBookmark = async () => {
    try{
      const response = await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}/isBookmarked/${currentUserId}/${id}`);
      if(response.data == true){
        setIsBookmarked(true);
      } else {
        setIsBookmarked(false);
      }
    } catch(e){
      return;
    }
  }

  //ブックマーク登録
  const handleBookmark = async () => {
    if(!currentUserId) { 
      alert("ログインしてください")
    }
    const formData = new FormData();
    formData.append("bookmark[user_id]", currentUserId);
    formData.append("bookmark[post_id]", id);
    try{
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/bookmarks`,
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

  //ブックマーク解除
  const handleUnBookmark = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/bookmarks/${currentUserId}/${id}`,
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

  
  //いいねの数を取得
  const getAmountOfLikes = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/favorites_count/${id}`
      );
      setAmountOfLikes(response.data);
      setLoading(false)
    } catch (e) {
      return;
    }
  };


  //いいねをすでにしているかを確認
  const isFavorite = async () => {
    try{
      const response = await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}/isFavorites/${currentUserId}/${id}`);
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

  //いいね登録
  const handleLike = async () => {
    if(!currentUserId) {
      alert("ログインしてください")
    }
    const formData = new FormData();
    formData.append("favorite[user_id]", currentUserId);
    formData.append("favorite[post_id]", id);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/favorites`,
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

  //いいね解除
  const handleUnLike = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/favorites/${currentUserId}/${id}`,
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
        <div style={{ position: 'relative', height: '250px' }}>
          <Image
            alt="image"
            src={image}
            height={250}
            width={250}
            objectFit="cover"
            layout="responsive"
            style={{marginTop:"8px"}}
            className={style.workImage}
          />
          </div>
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
        <h3 style={{color: theme == "#F8F9FA" ? "black" : "white" }}>{amountOfLikes} いいね</h3>
      </div>
    )
}
