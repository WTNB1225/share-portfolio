import { useState } from "react";
import { Data } from "../type";
import Cookies from "js-cookie";

export const useEditState = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [avatar, setAvatar] = useState<File[]>([])
  const [loginUser, setLoginUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [postDatas, setPostDatas] = useState<Data[]>([]);
  const [error, setError] = useState();
  const [editData, setEditData] = useState<Data[]>([]);
  const [profile, setProfile] = useState("");
  const [postData, setPostData] = useState<Data[]>([]);
  const [theme, setTheme] = useState(Cookies.get("theme") || "#F8F9FA");

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    passwordConfirmation, setPasswordConfirmation,
    avatar, setAvatar,
    loginUser, setLoginUser,
    loading, setLoading,
    token, setToken,
    userLoading, setUserLoading,
    postDatas, setPostDatas,
    error, setError,
    theme, setTheme,
    editData, setEditData,
    profile, setProfile,
  };
};