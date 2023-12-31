// UserWork.tsx

import Image from "next/image";
import Link from "next/link";
import style from "../src/styles/UserWork.module.css";

export default function UserWork({
  id,
  name,
  title,
  image,
}: {
  id: string;
  name: string;
  title: string;
  image: string;
}) {
  return (
    <div className={style.workContainer}>
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
