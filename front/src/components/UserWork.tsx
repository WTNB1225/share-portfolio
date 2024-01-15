// UserWork.tsx

import Image from "next/image";
import Link from "next/link";
import style from "@/styles/UserWork.module.css"

export default function UserWork({
  id,
  name,
  title,
  image,
  avatar
}: {
  id: string;
  name: string;
  title: string;
  image: string;
  avatar: string;
}) {
  return (
    <div className={style.workContainer}>
      <Link className={style.user} href={`/${name}`}>
        <Image className={style.img} src={avatar} width={40} height={40} alt="avatar"/>
        <h3>{name}</h3>
      </Link>
      <Link href={`/post/${name}/${id}`}>
        <Image
          alt=""
          src={image}
          height={300}
          width={400}
          layout="responsive"
          className={style.workImage}
        />
        <h2 className={style.workTitle}>{title}</h2>
      </Link>
    </div>
  );
}
