import { useState } from "react";
import { Data } from "../type";

export const useEditState = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loginUser, setLoginUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [postDatas, setPostDatas] = useState<Data[]>([]);
  const [error, setError] = useState();

  return {
    name, setName,
    email, setEmail,
    password, setPassword,
    passwordConfirmation, setPasswordConfirmation,
    loginUser, setLoginUser,
    loading, setLoading,
    token, setToken,
    userLoading, setUserLoading,
    postDatas, setPostDatas,
    error, setError
  };
};