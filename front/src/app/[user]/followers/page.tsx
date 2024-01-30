"use client";
import axios from "axios";
import Header from "../../../components/Header";
import FollowPage from "../../../components/FollowPage";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {useCheckLoginStatus} from "@/hook/useCheckLoginStatus"; 

type Data = {
  id: string;
  name: string;
};

export default function Followings() {
  const [datas, setDatas] = useState<Data[]>([]); 
  const [avatars, setAvatars] = useState<string[]>([]); 
  const [loading, setLoading] = useState<boolean>();

  const pathname = usePathname();
  const username = pathname.split("/").slice(-2)[0]; 
  const [loggedIn, setLoggedIn] = useState<boolean>(true);

  const {data, isLoading} = useCheckLoginStatus(); //{data: ログインしたユーザーの情報, isLoading: data取得中かどうか}
  useEffect(() => {
    if(isLoading == false) {
      if(!data) {
        setLoggedIn(false)
      }
      setLoading(false); //dataの取得完了
    }
  },[data, isLoading])
  const getFollowers = async (name: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/followers/${name}`
      );
      setDatas(response.data);
      return response.data;
    } catch (e) {
      return;
    }
  };

  const getUsersAvatar = async (name: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}/users/${name}`);
      return response.data.avatar_url;
    } catch (e) {
      return;
    }
  };

  useEffect(() => {
    getFollowers(username).then((followers) => {
      if (followers) {
        const avatarPromises = followers.map(
          async (following: { name: string }) => {
            const avatarUrl = await getUsersAvatar(following.name);
            return avatarUrl;
          }
        );

        Promise.all(avatarPromises).then((avatarUrls) => {
          setAvatars(avatarUrls.filter((url) => url)); // フィルターを追加してnullでないものだけを追加
        });
      }
    });
  }, [username]);

  if(loading !== false) return;

  if(loggedIn == false) {
    return(
      <>
        <Header />
        <h1 className="text-center" style={{marginTop:"32px"}}>ログインしてください</h1>
      </>
    )
  }

  return (
    <>
    <Header />
    <div className="container">
      <h1 className="text-center" style={{marginTop:"32px"}}>フォロワー</h1>
      {datas.map((d, index) => (
        <div className="row justify-content-center" key={index}>
          <div className="col-xs-12 col-md-6 col-lg-4 justify-content-center">
            <FollowPage img={avatars[index]} name={d.name} />
          </div>
        </div>
      ))}
    </div>
    </>
  );
}

