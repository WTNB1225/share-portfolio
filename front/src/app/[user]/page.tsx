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
import { FaUserPlus } from "react-icons/fa6";
import { FaUserMinus } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
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
  const [isFollowed, setIsFollowed] = useState<boolean | undefined>(undefined);
  const [paramName, setParamName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [presence, setPresence] = useState<boolean>();
  const [token, setToken] = useState<string>("");
  const [isUserProfileActionsRendered, setUserProfileActionsRendered] = useState(false);

  const pathname = usePathname();
  const splitpath = pathname.split("/");
  const username = splitpath[splitpath.length - 1]; // urlからusernameを取得

  const windowWidth = useWindowWidth();


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
    setLoading2(false);
  };

  const csrfToken = useGetCsrfToken();
  useEffect(() => {
    setToken(csrfToken);
    setLoading(false);
  }, [csrfToken]);

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
      if (response.data.name != null) {
        setPresence(true);
      } else {
        setPresence(false);
      }
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
    setLoading(false);
  };

  useEffect(() => {
    checkLoginStatus().then(() => {
      checkAlreadyFollowing(paramName);
    });
    getUserInfo();
    getUsersPosts(username);
  }, [paramName]);

  const UserProfileActions = ({
    username,
    userData,
    windowWidth,
    handleUnfollow,
    handleFollow,
    isFollowed,
  }: UserProfileActionsProps) => {
    if (!userData) return null;

    const isCurrentUser = decodeURIComponent(username) === userData.name;
    const isFollowedUser = decodeURIComponent(username) !== userData.name && isFollowed;

    useEffect(() => {
      setUserProfileActionsRendered(true);
    },[]);
    return (
      isFollowed !== undefined && 
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
          {isCurrentUser && (
            <a className={style.a} href={`/${username}/edit`}>
              {windowWidth <= 768 ? <FaUserEdit /> : "プロフィールを編集"}
            </a>
          )}
          {isFollowedUser && (
            <button
              onClick={() => handleUnfollow(String(userData.id))}
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

  if(loading == loading2 == false && ! presence){
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
