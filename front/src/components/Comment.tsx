import Image from "next/image";
import Link from "next/link";
import style from "@/styles/Comment.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons"
import axios from "axios";
import Markdown from "./Markdown";

export default function Comment({
  id,
  content,
  avatar,
  username,
  postAuthor,
  currentUser,
  onDelete,
}: {
  id: string;
  content: string;
  avatar: string;
  username: string;
  postAuthor: string;
  currentUser: string;
  onDelete: (id:string) => void; 
}){

  //投稿者とログインしているユーザーが一致しているとコメントを削除できる
  const handleDelete = async () => {
    if(postAuthor == currentUser){
      try{
        const response = await axios.delete(`http://localhost:3000/comments/${id}`);
        if(response.status == 200){
          onDelete(id)
        }
      } catch(e){
        console.log(e)
      }
    }
  }

  return(
    <div className={`row ${style.comment}`}>
      <div className="">
        <Link className={`${style.user}`} href={`/${username}`}>
          <Image className={style.img} src={avatar} width={40} height={40} alt="avatar" />
          <p>{username}</p>
        </Link>
      </div>
      <div className={`${style.inline} ${style.whitespace}`}>
        <Markdown content={content}></Markdown>
        {postAuthor == currentUser && (
          <button onClick={handleDelete} className={style.icon} style={{ width: '40px', height: '40px' }}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>
    </div>
  )
}