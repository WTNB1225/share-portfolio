import Image from "next/image";
import Link from "next/link";
import style from "@/styles/Comment.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className={`row ${style.comment}`}>
      <div className="col-12 col-md-2">
        <Link className={`${style.user}`} href={`/${username}`}>
          <Image className={style.img} src={avatar} width={40} height={40} alt="avatar" />
          <p>{username}</p>
        </Link>
      </div>
      <div className="col-10 col-md-10">
        <p>{content}</p>
      </div>
    </div>
  )
}