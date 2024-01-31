"use client";
import axios from "axios";
import Header from "../../../components/Header";
import FollowPage from "../../../components/FollowPage";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";

type Data = {
  id: string;
  name: string;
};

export default function Followings() {
  const [datas, setData] = useState<Data[]>([]); //followしてるユーザーの配列
  const [avatars, setAvatars] = useState<string[]>([]); //followしてるユーザーのアバターの配列

  const pathname = usePathname();
  const username = pathname.split("/").slice(-2)[0]; //URLからユーザー名を取得

  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [loading, setLoading] = useState(true);

  const {data, isLoading} = useCheckLoginStatus(); //{data: ログインしたユーザーの情報, isLoading: data取得中かどうか}
  useEffect(() => {
    if(isLoading == false) {
      if(!data) {
        setLoggedIn(false)
      }
      setLoading(false); //dataの取得完了
    }
  },[data, isLoading])

  //followしてるユーザーの配列を取得する関数
  const getFollowings = async (name: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/followings/${name}`
      );
      setData(response.data);
      return response.data;
    } catch (e) {
      return;
    }
  };

  //ユーザーのアバターを取得する関数
  const getUsersAvatar = async (name: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}/users/${name}`);
      return response.data.avatar_url;
    } catch (e) {
      return;
    }
  };

  useEffect(() => {
    getFollowings(username).then((followings) => {
      if (followings) {
        const avatarPromises = followings.map(
          async (following: { name: string }) => { //取得した配列からユーザー名を取り出してアバターを取得
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

  if(loading) return;

  if(loggedIn == false) {
    return(
      <>
        <Header />
        <h1 style={{marginTop:"32px"}} className="text-center">ログインしてください</h1>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="container">
      <h1 className="text-center" style={{marginTop:"32px"}}>フォロー中</h1>
      <div className="row d-flex justify-content-center">
        {datas.map((d, index) => (
          <div className="col-xs-12 col-md-6 col-lg-4" key={index}>
            <FollowPage img={avatars[index]} name={d.name} />
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
