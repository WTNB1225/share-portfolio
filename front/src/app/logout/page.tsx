"use client";

import axios from "axios";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import style from "./page.module.css"

export default function Logout() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.delete("http://localhost:3000/logout", {
        withCredentials: true,
      });
      console.log(response);
      router.push("/");
    } catch (e) {
      alert(e);
      console.log(e);
    }
  };

  return (
    <>
      <Header />
      <div>
        <form className={style.logout} onSubmit={handleSubmit}>
          <h1 className={style.center}>ログアウトしますか？</h1>
          <button className={style.logoutButton} type="submit">ログアウト</button>
        </form>
      </div>
    </>
  );
}
