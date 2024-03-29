import { useState } from "react";
import { Data } from "../type";
export const useBookmarkState = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState("");
  const [postData, setPostData] = useState<Data[]>([]);
  const [id, setId] = useState("");
  return { name, setName, loading, setLoading, token, setToken, postData, setPostData, id, setId };
};