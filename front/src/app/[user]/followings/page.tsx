"use client";
import axios from "axios";
import Header from "../../../components/Header";
import FollowPage from "../../../components/FollowPage";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Data = {
  id: string;
  name: string;
};

export default function Followings() {
  const [data, setData] = useState<Data[]>([]); //followしてるユーザーの配列
  const [avatars, setAvatars] = useState<string[]>([]); //followしてるユーザーのアバターの配列

  const pathname = usePathname();
  const username = pathname.split("/").slice(-2)[0]; //URLからユーザー名を取得

  //followしてるユーザーの配列を取得する関数
  const getFollowings = async (name: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/followings/${name}`
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
      const response = await axios.get(`http://localhost:3000/users/${name}`);
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

  return (
    <>
      <Header />
      <div className="container">
      <h1 className="text-center">フォロー中</h1>
      <div className="row d-flex justify-content-center">
        {data.map((d, index) => (
          <div className="col-xs-12 col-md-6 col-lg-4" key={index}>
            <FollowPage img={avatars[index]} name={d.name} />
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
