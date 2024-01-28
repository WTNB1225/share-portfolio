import Image from "next/image";
import Link from "next/link";
import style from "@/styles/Comment.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Cookies from "js-cookie";
import Markdown from "./Markdown";

export default function Comment({
  id,
  content,
  avatar,
  username,
  postAuthor,
  currentUser,
  onDelete,
  admin,
}: {
  id: string;
  content: string;
  avatar: string;
  username: string;
  postAuthor: string;
  currentUser: string;
  onDelete: (id: string) => void;
  admin: number;
}) {
  const theme = Cookies.get("theme") || "#F8F9FA";

  //コメントを削除する関数 admin or 投稿者のみ
  const handleDelete = async () => {
    if (postAuthor === currentUser || admin === 1) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/comments/${id}`
        );
        if (response.status == 200) {
          onDelete(id);
        }
      } catch (e) {
        return;
      }
    }
  };

  return (
    <div className={`row ${style.comment}`}>
      <div>
        <Link className={`${style.user}`} href={`/${username}`}>
          <Image
            className={style.img}
            src={avatar}
            width={40}
            height={40}
            alt="avatar"
          />
          <p style={{ color: theme == "#F8F9FA" ? "black" : "white" }}>
            {username}
          </p>
        </Link>
      </div>
      <div className={`${style.inline} ${style.whitespace}`}>
        <Markdown content={content}></Markdown>
        {(postAuthor == currentUser || admin == 1) && (
          <button
            onClick={handleDelete}
            className={style.icon}
            style={{ width: "40px", height: "40px", background: "none" }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>
    </div>
  );
}
