"use client";

import axios from "axios";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

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
        <form onSubmit={handleSubmit}>
          <button type="submit">ログアウト</button>
        </form>
      </div>
    </>
  );
}
