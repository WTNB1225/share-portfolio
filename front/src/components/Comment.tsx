import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Comment({
  content,
  avatar,
  username,
}: {
  content: string;
  avatar: string;
  username: string;
}){
  return(
    <div>
      <Link href={`/${username}`}>
        <Image src={avatar} width={40} height={40} alt="avatar" />
        <p>{username}</p>
      </Link>
      <p>{content}</p>
    </div>
  )
}