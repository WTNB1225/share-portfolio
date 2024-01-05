"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Header from "../../../../components/Header";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import style from "./page.module.css";

export default function Edit() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loginUser, setLoginUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState("")
  const router = useRouter();
  const pathname = usePathname();
  const splitPathname = pathname.split("/");
  const username = splitPathname[splitPathname.length - 2];

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get("http://localhost:3000/logged_in_user", {
        withCredentials: true,
      });
      setName(response.data.name)
      const csrfResponse = await axios.get("http://localhost:3000/csrf_token", {withCredentials: true,});
      setCsrfToken(csrfResponse.data.csrfToken);
      if (response.data.name != null) {
        setLoginUser(response.data.name);
      } else {
        setName("guest");
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false)
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  console.log(name)

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmationChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirmation(e.target.value);
  };

  const handleNameSubmit = async (e: FormEvent) => {
    const formData = new FormData();
    formData.append("user[name]", name);
    if (loginUser == username) {
      try {
        const response = await axios.patch(
          `http://localhost:3000/users/${username}`,
          formData,
          {
            headers:{
              "X-CSRF-Token": csrfToken
            },
            withCredentials:true
          }
        );
        router.push(`/${name}`);
      } catch (e) {
        alert(e);
      }
    } else {
      router.push("/401");
    }
  };
  const handleEmailSubmit = async (e: FormEvent) => {
    const formData = new FormData();
    formData.append("user[email]", email);
    if (loginUser == username) {
      try {
        const response = await axios.patch(
          `http://localhost:3000/users/${username}`,
          formData,
          {
            headers:{
              "X-CSRF-Token": csrfToken
            },
            withCredentials:true
          }
        );
        router.push(`/${name}`);
      } catch (e) {
        alert(e);
      }
    } else {
      router.push("/401");
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    const formData = new FormData();
    formData.append("user[password]", password);
    formData.append("user[password_confirmation]", passwordConfirmation)
    if (loginUser == username) {
      try {
        const response = await axios.patch(
          `http://localhost:3000/users/${username}`,
          formData,
          {
            headers:{
              "X-CSRF-Token": csrfToken
            },
            withCredentials:true
          }
        );
        router.push(`/${name}`);
      } catch (e) {
        alert(e);
      }
    } else {
      router.push("/401");
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  if(loading) {
    return;
  }

  if (loginUser !== username) {
    return (
      <div>
        <Header />
        <h1>401 Unauthorized</h1>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={`${style.div}`}>
        <label className={`${style.label}`}>
          name
          <input type="text" onChange={handleNameChange} />
          <button onClick={handleNameSubmit}>変更</button>
        </label>
        <label className={`${style.label}`}>
          email
          <input type="text" onChange={handleEmailChange} />
          <button onClick={handleEmailSubmit}>変更</button>
        </label>
        <label className={`${style.label}`}>
          password
          <input type="text" onChange={handlePasswordChange} />
          password confirmation
          <input type="text" onChange={handlePasswordConfirmationChange} />
          <button onClick={handlePasswordSubmit}>変更</button>
        </label>
      </div>
    </>
  );
}
