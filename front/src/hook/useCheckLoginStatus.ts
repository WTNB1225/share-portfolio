"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import { Data } from "../type";
import Cookies from "js-cookie";

export const useCheckLoginStatus = () => {
  const [data, setData] = useState<Data>();
  const [isLoading, setLoading] = useState(true);
  const [jwt, setJwt] = useState(localStorage.getItem("jwt") || "")//jwt


  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`; //jwtをヘッダーに含める
  }, [jwt]);

  useEffect(() => {
    //ログインしているユーザーの情報を取得する
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}/logged_in_user`, {
          withCredentials: true,
        });
        setData(response.data);
        setLoading(false);
      } catch (e) {
        //いないときはdataを取得せずにfalseにする
        setLoading(false);
        return;
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
};