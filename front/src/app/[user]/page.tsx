/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Image from "next/image";
import style from "./page.module.css";
import UserWork from "../../components/UserWork";

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

export default function User() {
  const [postData, setPostData] = useState<Data[]>([]);
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [avatar, setAvatar] = useState("");
  const [isFollowed, setIsFollowed] = useState<boolean | undefined>(undefined);
  const [paramName, setParamName] = useState<string>("");

  const pathname = usePathname();
  const splitpath = pathname.split("/");
  const username = splitpath[splitpath.length - 1]; // urlからusernameを取得

  const tmp = "test";

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get("http://localhost:3000/logged_in_user", {
        withCredentials: true,
      });
      if (response.data.name != null) {
        setParamName(response.data.name);
        setUserData(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //nameのpostデータを取得する
  const getUsersPosts = async (name: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/posts/${name}`);
      setPostData(response.data);
    } catch (e) {
      alert(e);
    }
  };

  //usernameのユーザー情報を取得
  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/${username}`
      );
      setAvatar(response.data.avatar_url);
    } catch (e) {
      console.log(e);
    }
  };

  //フォローの処理
  const handleFollow = async () => {
    const formData = new FormData();
    formData.append("relationship[current_user]", paramName);
    formData.append("relationship[name]", username);
    try {
      await axios.post("http://localhost:3000/relationships", formData, {
        withCredentials: true,
      });
      setIsFollowed(true);
    } catch (e) {
      console.log(e);
    }
  };

  //フォロー解除の処理
  const handleUnfollow = async (id: string) => {
    const formData = new FormData();
    formData.append("relationship[current_user]", paramName);
    formData.append("relationship[name]", username);
    try {
      await axios.delete(`http://localhost:3000/relationships/${id}`, {
        data: formData,
        withCredentials: true,
      });
      setIsFollowed(false);
    } catch (e) {
      console.log(e);
    }
  };

  //loginしているuserがすでにフォローしているか確認
  const checkAlreadyFollowing = async (followName: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/followings/${followName}`
      );
      const isAlreadyFollowing = response.data.some(
        (follow: { name: string }) => follow?.name === username
      );
      setIsFollowed(isAlreadyFollowing);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkLoginStatus().then(() => {
      checkAlreadyFollowing(tmp);
    });
    getUserInfo();
    getUsersPosts(username);
  }, [paramName]);

  return (
    <>
      <Header />
      <div className={style.avatar}>
        <Image
          className={style.img}
          src={avatar}
          width={80}
          height={80}
          alt="avatar"
        />
        <h1>{username}</h1>
        <a className={style.a} href={`/${username}/followings`}>
          フォロー中
        </a>
        <a className={style.a} href={`/${username}/followers`}>
          フォロワー
        </a>
        {userData && username === userData.name && (
          <a className={style.a} href={`/${username}/edit`}>
            プロフィールを編集
          </a>
        )}
        {userData && username !== paramName && isFollowed === true && (
          <>
            <button
              onClick={() => {
                handleUnfollow(userData.id);
              }}
              className={style.a}
            >
              フォロー解除
            </button>
          </>
        )}
        {userData && username !== paramName && isFollowed === false && (
          <button onClick={handleFollow} className={style.a}>
            フォロー
          </button>
        )}
      </div>
      {postData.map((d, index) => (
        <UserWork
          key={index}
          title={d.title}
          id={d.id}
          name={d.username}
          image={d.images_url[0]}
          avatar={avatar}
        />
      ))}
    </>
  );
}
