/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import axios from "axios";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "../../../../components/Header";
import style from "./page.module.css";
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";
import Comment from "@/components/Comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Markdown from "@/components/Markdown";

type Data = {
  user_id: string;
  post_id: string;
  content: string;
  avatar_url: string;
  name: string;
  id: string;
};

export default function PostId() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [comments, setComments] = useState<Data[]>([]);
  const [commentLoading, setCommentLoading] = useState(true);
  const [userData, setUserData] = useState<Data[]>([]);
  const [postAuthor, setPostAuthor] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [authorId, setAuthorId] = useState("");

  const pathname = usePathname();
  const id = pathname.split("/").reverse()[0];
  const router = useRouter();

  const getPostById = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/post/${id}`, {
        withCredentials: true,
      });
      setTitle(response.data.title);
      setContent(response.data.content);
      setUrl(response.data.images_url);
      setPostAuthor(response.data.username);
      setLoading(false);
      setAuthorId(response.data.user_id);
      try{
        const authorRes = await axios.get(
          `http://localhost:3000/user/${response.data.id}`,
          {
            withCredentials: true,
          }
        )
        setAvatar(authorRes.data.avatar_url);
      } catch(e) {
        console.log(e)
      }
    } catch (e) {
      alert(e);
    }
  };

  console.log(postAuthor)
  console.log(avatar)

  const getComment = async (id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/showPostComments/${id}`
      );
      if (response.data != null) {
        const tmpData = [];
        for (let d of response.data) {
          const response = await axios.get(
            `http://localhost:3000/user/${d.user_id}`
          );
          tmpData.push(response.data);
        }
        setUserData(tmpData);
      }
      setComments(response.data);
      setCommentLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const {data, isLoading} = useCheckLoginStatus();
  useEffect(() => {
    if (isLoading == false) {
      setUserId(data?.id!);
      setCurrentUserName(data?.name!);
      setAvatar(data?.avatar_url!);
    }
  }, [data, isLoading]);


  const csrfToken = useGetCsrfToken();
  useEffect(() => {
    setToken(csrfToken); 
    setLoading(false);
  }, [csrfToken]);


  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/posts/${id}`, {
        withCredentials: true,
        headers: {
          "X-CSRF-Token": token,
        },
      });
      console.log(response.data);
      router.push(`/post`);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteResult = (id: string) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("comment[content]", comment);
    formData.append("comment[post_id]", id);
    formData.append("comment[user_id]", userId);
    try {
      const response = await axios.post(
        "http://localhost:3000/comments",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRF-Token": token,
          },
        }
      );
      setComment("");
      getComment(id);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getPostById(id);
    getComment(id);
  }, []);

  console.log(userId)
  console.log(authorId)

  return (
    <>
      <Header />
      <div className="container" style={{marginTop:"32px"}}>
        <div className={`row`}>
          <div className={`col-12 ${style.mobileCenter}`}>
            <h1>{title}</h1>
            <div className={`${style["markdown-content"]} ${style.whitespace}`}>
              <Markdown content={content}></Markdown>
            </div>
            {authorId == userId && loading == false && (
              <div className="delete">
                <button
                  className={`btn btn-danger ${style.icon}`}
                  onClick={handleDelete}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {loading == false && (
        <>
          <div className="container">
            <div className={`row ${style.mobileCenter}`}>
              <div className="col-12">
                <h3 className={style.h3}>コメント一覧</h3>
                {comments.map((commentData, index) => {
                  return (
                    <div className={`row ${style.comment}`} key={index}>
                      <div className="col-12">
                        <Comment
                          key={index}
                          id={commentData.id}
                          content={commentData.content}
                          avatar={userData[index].avatar_url}
                          username={userData[index].name}
                          currentUser={userId}
                          postAuthor={authorId}
                          onDelete={handleDeleteResult}
                        />
                        {index === comments.length - 1 && (
                          <div className={style.border}></div>
                        )}
                        {index === comments.length - 1 && commentLoading == false && (
                          <>
                            <h3 style={{ marginTop: "16px" }}>コメントする</h3>
                            <textarea
                              className={`form-control ${style.textarea}`}
                              style={{ width: "100%" }}
                              value={comment}
                              onChange={handleCommentChange}
                            ></textarea>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <button
                                className="btn btn-primary mt-2"
                                type="submit"
                                onClick={handleSubmit}
                              >コメント</button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {comments.length == 0 && (
            <>
              <div className="container">
                <div className="row mobile-center">
                  <div className="col-12">
                    <h3 style={{ marginTop: "16px" }}>コメントする</h3>
                    <textarea
                      className={`form-control ${style.textarea}`}
                      style={{ width: "100%" }}
                      value={comment}
                      onChange={handleCommentChange}
                    ></textarea>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        className="btn btn-primary mt-2"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        送信
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}


