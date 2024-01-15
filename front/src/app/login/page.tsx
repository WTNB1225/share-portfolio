"use client";
import style from "./page.module.css";
import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import flash from "next-flash";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(-1);
  

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRemember(remember * -1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("session[email]", email);
    formData.append("session[password]", password);
    formData.append("session[remember_me]", remember.toString());

    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      router.push("/home");
    } catch (e) {
      flash.set({ name: 'hoge123' })
      console.log(e);
    }
  };

  return (
    <>
      <Header />
      <div>
        <form className={`${style.form}`} onSubmit={handleSubmit}>
          <label className={style.label}>
            Email
            <input type="text" onChange={handleEmailChange} />
          </label>
          <label className={style.label}>
            Password
            <input type="password" onChange={handlePasswordChange} />
          </label>
          <label>
            Remember
            <input type="checkbox" onChange={handleCheckboxChange} />
          </label>
          <button type="submit">ログイン</button>
        </form>
      </div>
    </>
  );
}
