import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie"


export const useGetCsrfToken = () => {
  const [token, setToken] = useState("");
  const [jwt, setJwt] = useState(Cookies.get("_vercel_jwt") || "");


  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `${jwt}`;
  }, [jwt]);

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