import { useState } from "react";
import { Data } from "../type";

export const useUsersFavoriteState = () => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [usernameId, setUsernameId] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [usernameLoading, setUsernameLoading] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [postId, setPostId] = useState<Data[]>([]);
  const [postData, setPostData] = useState<Data[]>([]);
  const [token, setToken] = useState("");

  return {
    name, setName,
    userId, setUserId,
    usernameLoading, setUsernameLoading,
    usernameId, setUsernameId,
    userLoading, setUserLoading,
    loading, setLoading,
    postId, setPostId,
    postData, setPostData,
    token, setToken
  };
};