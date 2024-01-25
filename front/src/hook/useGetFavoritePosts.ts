
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


  const {data, isLoading} = useCheckLoginStatus();
  useEffect(() => {
    if (isLoading == false) {
      setUserId(data?.id!);
      setName(data?.name!);
      setLoading(false);
    }
  }, [data, isLoading]);
  useEffect(() => {
    const useFetchData = () => {
      const token = useGetCsrfToken();
      if (token) {
        setToken(token);
      }
    };
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFetchData();
  }, []);

  return { name, userId, loading, postId, postData, token };
};