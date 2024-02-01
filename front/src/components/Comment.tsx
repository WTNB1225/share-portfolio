import Image from "next/image";
import Link from "next/link";
import style from "@/styles/Comment.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Cookies from "js-cookie";
import Markdown from "./Markdown";
import { useState, useEffect } from "react";
import { headers } from "next/headers";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";

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
  admin: boolean;
}) {
  const theme = Cookies.get("theme") || "#F8F9FA";

  const [token, setToken] = useState<string>("");
  const csrfToken = useGetCsrfToken();

  useEffect(() => {
    setToken(csrfToken);
  }, [csrfToken]);

  //コメントを削除する関数 admin or 投稿者のみ
  const handleDelete = async () => {
    if (postAuthor === currentUser || admin == true) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/comments/${id}`,
          {
            headers: {
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
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
        {(postAuthor == currentUser || admin == true) && (
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
