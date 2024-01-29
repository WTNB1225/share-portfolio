"use client";
import Image from "next/image";
import Link from "next/link";
import style from "@/styles/FollowPage.module.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
export default function FollowPage({
  name,
  img,
}: {
  name: string;
  img: string;
}) {
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const cookieTheme = Cookies.get("theme");
    setTheme(cookieTheme || "#F8F9FA");
  }, [theme]);

  return (
    <div className={`${style.user} d-flex justify-content-center`} style={{marginRight:"8px"}}>
      <Link
        href={`/${name}`}
        className={`${style.user} d-flex align-items-center`}
        style={{
          color: theme == "#F8F9FA" ? "black" : "white",
          textDecoration: "none",
        }}
      >
        <Image
          className={`${style.img} d-flex`}
          src={img}
          width={40}
          height={40}
          alt="avatar"
        />
        <p style={{marginTop:"16px", marginLeft:"8px"}}>{name}</p>
      </Link>
    </div>
  );
}
