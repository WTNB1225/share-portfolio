import axios from "axios";
import { useEffect, useState } from "react";

export const useGetCsrfToken = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchData = async() => {
      try{
        const response = await axios.get("http://localhost:3000/csrf_token", {withCredentials: true});
        setToken(response.headers["x-csrf-token"]);
      } catch(e) {
        return;
      }
    }
    fetchData();
  } ,[]);

  return token 
}