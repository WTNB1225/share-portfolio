"use client"
import Image from "next/image"
import Link from "next/link"
import style from "@/styles/FollowPage.module.css"

export default function FollowPage({
  name,
  img
}: {
  name:string,
  img:string
}) {
  return(
    <div className={style.user}>
      <Image className={style.img} src={img} width={40} height={40} alt="avatar"/>
      {name}
    </div>
  )
}