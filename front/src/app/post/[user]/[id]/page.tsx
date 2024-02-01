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
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import Markdown from "@/components/Markdown";
import { usePageIdState } from "@/hook/usePostIdState";

type Data = {
  admin: boolean;
  user_id: string;
  post_id: string;
  content: string;
  avatar_url: string;
  name: string;
  id: string;
};

export default function PostId() {
  const {
    title,
    setTitle,
    content,
    setContent,
    url,
    setUrl,
    comment,
    setComment,
    userId,
    setUserId,
    token,
    setToken,
    comments,
    setComments,
    commentLoading,
    setCommentLoading,
    userData,
    setUserData,
    postAuthor,
    setPostAuthor,
    currentUserName,
    setCurrentUserName,
    loading,
    setLoading,
    avatar,
    setAvatar,
    authorId,
    setAuthorId,
    isAdmin,
    setIsAdmin,
    errorMessage,
    setErrorMessage,
  } = usePageIdState();

  const pathname = usePathname();
  const username = pathname.split("/").reverse()[1]; //URLからユーザー名を取得
  const id = pathname.split("/").reverse()[0]; //URLから投稿IDを取得
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState<boolean>(); //ログインしているかどうか
  const [userLoading, setUserLoading] = useState<boolean>(true); //ユーザー情報を取得中かどうか

  //投稿を取得する関数
  const getPostById = async (id: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/post/${id}`,
        {
          withCredentials: true,
        }
      );
      setTitle(response.data.title);
      setContent(response.data.content);
      setUrl(response.data.images_url);
      setPostAuthor(response.data.username);
      setAuthorId(response.data.user_id);
      try {
        const authorRes = await axios.get(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/user/${response.data.id}`,
          {
            withCredentials: true,
          }
        );
        setAvatar(authorRes.data.avatar_url);
      } catch (e) {
        return;
      }
    } catch (e: any) {
      setCommentLoading(true);
      setErrorMessage(
        "エラーが発生しました。あなたがログインしていないか, 投稿が存在しません。"
      );
    } finally {
      setLoading(false); //投稿の取得完了 or エラー
    }
  };

  //コメントを取得する関数
  const getComment = async (id: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/showPostComments/${id}`
      );
      if (response.data != null) {
        const tmpData = [];
        for (let d of response.data) {
          //ループでコメントに対応したidのユーザーを取得
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_ENDPOINT}/user/${d.user_id}`
          );
          tmpData.push(response.data);
        }
        setUserData(tmpData);
      }
      setComments(response.data);
    } catch (e) {
      return;
    } finally {
      setCommentLoading(false); //コメントの取得完了 or エラー
    }
  };

  const { data, isLoading } = useCheckLoginStatus(); //{data: ログインしたユーザーの情報, isLoading: data取得中かどうか}

  useEffect(() => {
    if (isLoading == false) {
      if (data) {
        setUserId(data?.id!);
        setCurrentUserName(data?.name!);
        setAvatar(data?.avatar_url!);
        setIsAdmin(!!data?.admin);
      }
    } else {
      setLoggedIn(false);
    }
    setUserLoading(false);
  }, [data, isLoading]);

  //CSRFトークンを取得するカスタムフック
  const csrfToken = useGetCsrfToken();
  useEffect(() => {
    setToken(csrfToken);
  }, [csrfToken]);

  //コメントの内容を変更する関数
  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  //投稿を削除する関数
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/posts/${id}`,
        {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": token,
          },
        }
      );
      router.push(`/post`);
    } catch (e) {
      return;
    }
  };

  //Commentコンポーネントから削除したとき、再レンダリングをするための関数
  const handleDeleteResult = (id: string) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  //コメントを投稿する関数
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("comment[content]", comment);
    formData.append("comment[post_id]", id);
    formData.append("comment[user_id]", userId);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/comments`,
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
      return;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getPostById(id);
      await getComment(id);
    };
    fetchData();
  }, []);

  if (userLoading || isLoading) return;

  if (loggedIn == false) {
    <>
      <Header />
      <h1 className="text-center" style={{ marginTop: "32px" }}>
        ログインしてください
      </h1>
    </>;
  }

  if (errorMessage) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="text-center" style={{ marginTop: "32px" }}>
                {errorMessage}
              </h1>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    loading == false && (
      <>
        <Header />
        <div className="container" style={{ marginTop: "32px" }}>
          <div className={`row`}>
            <div className={`col-12 ${style.mobileCenter}`}>
              <h1>{title}</h1>
              <div
                className={`${style["markdown-content"]} ${style.whitespace}`}
                style={{ marginTop: "32px" }}
              >
                <Markdown content={content}></Markdown>
              </div>
              {(authorId == userId || isAdmin == true) && loading == false && (
                <div>
                  <div className="delete">
                    <button
                      className={`btn btn-danger ${style.icon}`}
                      onClick={handleDelete}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <div className="edit">
                    <a href={`/post/${username}/${id}/edit`}>
                      <FontAwesomeIcon size="2xl" icon={faEdit} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {commentLoading == false && errorMessage == "" && (
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
                          admin={isAdmin || false}
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
                        {index === comments.length - 1 &&
                          commentLoading == false && (
                            <>
                              <h3 style={{ marginTop: "16px" }}>
                                コメントする
                              </h3>
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
                                  コメント
                                </button>
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
        )}
        {comments.length == 0 &&
          loading == false &&
          commentLoading == false && (
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
    )
  );
}
