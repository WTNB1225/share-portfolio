import axios from "axios";
import { useEffect, useState } from "react";

interface Data {
  id: string
  name:string;
  avatar_url: string;
  admin: number;
}
export const useCheckLoginStatus = () => {
  const [data, setData] = useState<Data>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/logged_in_user", {
          withCredentials: true,
        });
        setData(response.data);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        return;
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
};