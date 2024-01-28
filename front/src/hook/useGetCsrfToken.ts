import axios from "axios";
import { useEffect, useState } from "react";

export const useGetCsrfToken = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchData = async() => {
      try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}/csrf_token`, {withCredentials: true});
        setToken(response.headers["x-csrf-token"]); //response.headers["x-csrf-token"]はtokenの値
      } catch(e) {
        return;
      }
    }
    fetchData();
  } ,[]);

  return token 
}