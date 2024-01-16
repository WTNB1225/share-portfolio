"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import style from "./page.module.css";
import { useRouter, usePathname } from "next/navigation";
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";

type Data = {
  id: string;
  title: string;
  content: string;
  image: string;
  images_url: string;
  username: string;
  avatar_url: string;
  post_id: string;
};

export default function Bookmark() {

}

