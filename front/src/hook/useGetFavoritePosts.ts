
import { useState, useEffect } from "react";
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";
import axios from "axios";
import { Data } from "../type.d";

export const usePageData = () => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [postId, setPostId] = useState<Data[]>([]);
  const [postData, setPostData] = useState<Data[]>([]);
  const [token, setToken] = useState(""); 

  useEffect(() => {
    const useFetchData = async () => {
      const data = await useCheckLoginStatus();
      if (data) {
        setName(data.name);
        setUserId(data.id);
      } else {
        setUserId("");
      }
      setLoading(false);

      const token = await useGetCsrfToken();
      if (token) {
        setToken(token);
      }
    };
    useFetchData();
  }, []);

  return { name, userId, loading, postId, postData, token };
};