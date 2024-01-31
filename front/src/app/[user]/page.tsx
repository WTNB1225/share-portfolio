/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Image from "next/image";
import style from "./page.module.css";
import UserWork from "../../components/UserWork";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";
import { FaUserPlus } from "react-icons/fa6";
import { FaUserMinus } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { useWindowWidth } from "@/hook/useWindowWidth";

type Data = {
  images_url: string;
  title: string;
  content: string;
  id: string;
  username: string;
  name: string;
};

type UserData = {
  name: string;
  id: string;
};

type UserProfileActionsProps = {
  username: string;
  userData:
    | {
        id: string;
        name: string;
      }
    | undefined;
  windowWidth: number;
  handleUnfollow: (id: string) => void;
  handleFollow: () => void;
  isFollowed: boolean | undefined;
};

export default function User() {
  const [postData, setPostData] = useState<Data[]>([]);
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [avatar, setAvatar] = useState("");
  const [isFollowed, setIsFollowed] = useState<boolean | undefined>(undefined); //loginしているuserが相手をすでにフォローしているか
  const [paramName, setParamName] = useState<string>("");  //apiのパラメーターに使うname
  const [loading, setLoading] = useState(true); //フォローの情報を取得するまでtrue
  const [loading2, setLoading2] = useState(true); //ログインユーザーの情報を取得するまでtrue
  const [presence, setPresence] = useState(true); //存在しないユーザーの場合はfalseになる
  const [token, setToken] = useState<string>(""); 
  const [loggedIn, setLoggedIn] = useState<boolean>(); //ログインしているかどうか

  const pathname = usePathname();
  const splitpath = pathname.split("/");
  const username = splitpath[splitpath.length - 1]; // urlからusernameを取得

  //画面幅を取得
  const windowWidth = useWindowWidth();

  const {data, isLoading} = useCheckLoginStatus(); 
  useEffect(() => {
    if(isLoading == false) {
      if(data) {
        setParamName(data.name);
        setUserData(data)
      } else {
        setLoggedIn(false)
      }
      setLoading2(false)
    }
  },[data, isLoading]);

  const csrfToken = useGetCsrfToken();
  useEffect(() => {
    setToken(csrfToken);
  }, [csrfToken]);

  //nameのpostデータを取得する
  const getUsersPosts = async (name: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}/posts/${name}`);
      setPostData(response.data);
    } catch (e) {
      return;
    }
  };

  //usernameのユーザー情報を取得
  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/users/${username}`
      );
      if (response.data == null) {
        setPresence(false);
      } else {
        setPresence(true);
        setAvatar(response.data.avatar_url);
      }
    } catch (e) {
      return;
    }
  };


  //フォローの処理
  const handleFollow = async () => {
    const formData = new FormData();
    formData.append("relationship[current_user]", paramName);
    formData.append("relationship[name]", username);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_ENDPOINT}/relationships`, formData, {
        withCredentials: true,
      });
      setIsFollowed(true);
    } catch (e) {
      return;
    }
  };

  //フォロー解除の処理
  const handleUnfollow = async (id: string) => {
    const formData = new FormData();
    formData.append("relationship[current_user]", paramName);
    formData.append("relationship[name]", username);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_ENDPOINT}/relationships/${id}`, {
        data: formData,
        withCredentials: true,
      });
      setIsFollowed(false);
    } catch (e) {
      return;
    }
  };

  //loginしているuserがすでにフォローしているか確認
  const checkAlreadyFollowing = async (followName: string | undefined) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/followings/${followName}`
      );
      const isAlreadyFollowing = response.data.some(
        (follow: { name: string }) => follow?.name === username
      );
      setIsFollowed(isAlreadyFollowing);
    } catch (e) {
    } finally{
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    getUserInfo();
    getUsersPosts(username);
    checkAlreadyFollowing(paramName);
  }, [paramName]);

  const UserProfileActions = ({
    username,
    userData,
    windowWidth,
    handleUnfollow,
    handleFollow,
    isFollowed,
  }: UserProfileActionsProps) => {

    const isCurrentUser = decodeURIComponent(username) === userData?.name;
    const isFollowedUser = decodeURIComponent(username) !== userData?.name && isFollowed;

    return (
      <>
        <div className={`col-12 align-items-center text-center`} style={{marginTop:"32px"}}>
          <Image
            className={style.img}
            src={avatar}
            width={80}
            height={80}
            alt="avatar"
          />
          <h1>{decodeURIComponent(username)}</h1>
        </div>
        <div className="align-items-center text-center">
          <a
            style={{ marginRight: "8px" }}
            className={style.a}
            href={`/${username}/followings`}
          >
            {windowWidth <= 768 ? <FaUserCheck /> : "フォロー中"}
          </a>
          <a
            style={{ marginRight: "8px" }}
            className={style.a}
            href={`/${username}/followers`}
          >
            {windowWidth <= 768 ? <FaUserFriends /> : "フォロワー"}
          </a>
          <a href={`/${username}/`}
            className={style.a}
            style={{marginRight:"8px"}}
          >
            {windowWidth <= 768 ? <FaHeart /> : "いいねした投稿"}
          </a>
          {isCurrentUser && (
            <>
              <a className={style.a} href={`/${username}/edit`}>
                {windowWidth <= 768 ? <FaUserEdit /> : "プロフィールを編集"}
              </a>
              <a className={style.a} href={`/${username}/bookmark`}>
                {windowWidth <= 768 ? <FaBookmark /> : "ブックマーク"}
              </a>
            </>
          )}
          {isFollowedUser && (
            <button
              onClick={() => handleUnfollow(String(userData?.id))}
              className={style.a}
            >
              {windowWidth <= 768 ? <FaUserMinus /> : "フォロー解除"}
            </button>
          )}
          {!isCurrentUser && isFollowed == false && (
            <button onClick={handleFollow} className={style.a}>
              {windowWidth <= 768 ? <FaUserPlus /> : "フォロー"}
            </button>
          )}
        </div>
        <div className="container" style={{ marginTop: "32px" }}>
          <div className="row">
          {postData.map((d, index) => (
            <div
              key={index}
              className={`col-sm-12 col-md-6 col-lg-4 ${style.userWork}`}
            >
              <UserWork
                key={index}
                title={d.title}
                id={d.id}
                name={d.username}
                image={d.images_url[0]}
                avatar={avatar}
                token={token}
              />
            </div>
          ))}
          </div>
        </div>
      </>
    );
  };


  if (loading || loading2) {
    return;
  }

  if(loggedIn == false) {
    return(
      <>
        <Header />
        <h1 className="text-center" style={{marginTop:"32px"}}>ログインしてください</h1>
      </>
    )
  }

  if((loading == false && loading2 == false ) && (presence == false)){
    return(
      <>
        <Header />
          <div className="container" style={{ marginTop: "32px" }}>
            <div className="row">
              <p className="col-12">ユーザーが存在しません</p>
            </div>
          </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <UserProfileActions
        username={username}
        userData={userData}
        windowWidth={windowWidth}
        handleUnfollow={handleUnfollow}
        handleFollow={handleFollow}
        isFollowed={isFollowed}
      />
    </>
  );
}
