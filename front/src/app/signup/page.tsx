"use client";

import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import style from "./page.module.css";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [avatar, setAvatar] = useState<File[]>([]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmation = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(e.target.value);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatar(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user[name]", name);
    formData.append("user[email]", email);
    formData.append("user[password]", password);
    formData.append("user[password_confirmation]", passwordConfirmation);
    avatar.forEach((img) => {
      formData.append("user[avatar]", img);
    });
    try {
      const response = await axios.post(
        "http://localhost:3000/users",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(response);
      router.push("/");
    } catch (e) {
      alert(e);
    }
  };

  return (
    <>
      <Header />
      <div>
        <form className={style.form} onSubmit={handleSubmit}>
          <label className={style.label}>
            name
            <input type="text" onChange={handleNameChange} />
          </label>
          <label className={style.label}>
            email
            <input type="text" onChange={handleEmailChange} />
          </label>
          <label className={`${style.label}`}>
            avatar
            <input
              className={style.file}
              type="file"
              onChange={handleAvatarChange}
            />
          </label>
          <label className={style.label}>
            password
            <input type="text" onChange={handlePasswordChange} />
          </label>
          <label className={style.label}>
            password confirmation
            <input type="text" onChange={handlePasswordConfirmation} />
          </label>
          <button type="submit">登録</button>
        </form>
      </div>
    </>
  );
}
