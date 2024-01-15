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
  const [data, setData] = useState<Data[]>([]); // Data should be an array
  const [avatars, setAvatars] = useState<string[]>([]); // Renamed for clarity

  const pathname = usePathname();
  const username = pathname.split("/").slice(-2)[0]; // More robust way to get username

  const getFollowings = async (name: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/followings/${name}`
      );
      setData(response.data);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  };

  const getUsersAvatar = async (name: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${name}`);
      return response.data.avatar_url;
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getFollowings(username).then((followings) => {
      if (followings) {
        const avatarPromises = followings.map(
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

  //console.log(data)

  return (
    <div>
      <Header />
      <h1>フォロー中</h1>
      {data.map((d, index) => (
        <FollowPage key={index} img={avatars[index]} name={d.name} />
      ))}
    </div>
  );
}
