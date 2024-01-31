"use client";
import axios from "axios";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import style from "./page.module.css"
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";

export default function Logout() {
  const [loading, setLoading] = useState(true); //ログイン状態の確認中かどうか
  const router = useRouter();
  const {data, isLoading} = useCheckLoginStatus(); //ログイン状態を取得するカスタムフック

  useEffect(() => {
    if(!isLoading && !data) {
      router.replace("/");
    } else if(!isLoading && data) {
      setLoading(false);
    }
  }, [isLoading, data]);

  //ログアウトの処理
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_ENDPOINT}/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem("jwt");
      router.push("/");
    } catch (e) {
      return;
    }
  };
  
  if(loading) return;

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
