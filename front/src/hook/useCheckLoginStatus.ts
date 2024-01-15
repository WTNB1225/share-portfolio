import { useState, useEffect } from "react";
import axios from "axios";

type Data = {
  id: string
  name:string;
}

export const useCheckLoginStatus = async () => {
  const [data, setData] = useState<Data>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/logged_in_user", {
          withCredentials: true,
        });
        setData(response.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  return data;
};

