import axios from "axios";
import { useEffect, useState } from "react";
import { Data } from "../type";

export const useCheckLoginStatus = () => {
  const [data, setData] = useState<Data>();
  const [isLoading, setLoading] = useState(true);


  useEffect(() => {
    //ログインしているユーザーの情報を取得する
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/logged_in_user", {
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