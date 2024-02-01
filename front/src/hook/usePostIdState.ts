import { useState } from "react";
import { Data } from "../type";

export const usePageIdState = () => {
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
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState("");

  return {
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
  };
};
