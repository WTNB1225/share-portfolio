"use client";
import axios from "axios";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import { useCheckLoginStatus } from "../../../hook/useCheckLoginStatus";
import { useGetCsrfToken } from "../../../hook/useGetCsrfToken";
import Preview from "@/components/Preview";
import Markdown from "@/components/Markdown";
import style from "./page.module.css";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { useWindowWidth } from "@/hook/useWindowWidth";
import Cookies from "js-cookie";
import dotenv from "dotenv";

export default function PostNew() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File>();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [token, setToken] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(Cookies.get("theme") || "#F8F9FA");
  dotenv.config();

  const { data, isLoading } = useCheckLoginStatus(); //{data: ログインしたユーザーの情報, isLoading: data取得中かどうか}
  useEffect(() => {
    if (isLoading == false) {
      setId(data?.id!);
      setName(data?.name!);
      setAvatar(data?.avatar_url!);
      setUserLoading(false);
    }
  }, [data, isLoading]);

  //画面サイズ取得
  const width = useWindowWidth();

  //CSRFトークンを取得する関数
  const csrfToken = useGetCsrfToken();
  useEffect(() => {
    setToken(csrfToken);
    setLoading(false);
  }, [csrfToken]);

  //CloudFlareR2のためにS3Clientを作成(互換性がある)
  const S3 = new S3Client({
    region: "auto",
    endpoint: process.env.NEXT_PUBLIC_CLOUDFLARE_ENDPOINT as string,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCESS_KEY as string,
    },
  });

  //inputの値が変更されたらstateを更新する関数
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    setContent(e.target.value);
  };

  //サムネイルの画像をstateに保存する関数
  const handleThumbnailChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      setImage(files[0]);
    }
  };

  //画像をR2にアップロードする関数
  const handleImagesChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach(async (file) => {
        //画像を1つずつアップロード
        if (file.size > 5 * 1024 * 1024) {
          setContent(
            (prevContent) => prevContent + "\n" + "画像のサイズが大きすぎます"
          );
        } else {
          await S3.send(
            new PutObjectCommand({
              Bucket: process.env.NEXT_PUBLIC_CLOUDFLARE_BUCKET as string,
              Key: file.name,
              Body: file,
              ContentType: file.type,
            })
          );

          const encodedFileName = encodeURIComponent(file.name); //特殊文字が含まれないようにエンコード
          //R2に保存した画像のURLを取得
          const imageUrl = `![${file.name}](${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT}/${encodedFileName})`;
          setContent((prevContent) => prevContent + "\n" + imageUrl); //contentに反映
        }
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!csrfToken) {
      return;
    }

    const formData = new FormData();
    formData.append("post[title]", title);
    formData.append("post[content]", content);
    formData.append("post[user_id]", id);
    formData.append("post[username]", name);
    formData.append("post[avatar_url]", avatar);
    formData.append("post[like]", "0");
    formData.append("post[userid]", String(id));
    if (image) {
      formData.append("post[images][]", image);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRF-Token": token, // ヘッダーにCSRFトークンを追加
          },
          withCredentials: true,
        }
      );
      router.push("/post");
    } catch (e: any) {
      setError(e.response.data); //Railsのvalidationを設定
      return;
    }
  };

  //loading中は何も表示しない
  if (loading || userLoading) {
    return;
  }

  //ログインしていない場合
  if (
    loading == false &&
    userLoading == false &&
    (name == "" || name == undefined)
  ) {
    return (
      <>
        <Header />
        <div
          className="container d-flex justify-content-center"
          style={{ marginTop: "32px" }}
        >
              <div className="col-12 col-md-6">
                <h2 className="text-center">ログインしてください</h2>
              </div>
            </div>
      </>
    );
  }

  return (
    <>
      <Header />
      {error && (
        <div className="alert alert-danger" role="alert">
          {Object.entries(error).map(([key, value]) => (
            <div key={key}>{`${key}: ${value}`}</div>
          ))}
        </div>
      )}
      <div
        className="container d-flex justify-content-center"
        style={{ marginTop: "32px" }}
      >
        <p className="text-center">本文は1000文字以内</p>
        <div className="col-12 col-lg-8">
          <>
            <form className="row g-3 justify-content-center">
              <div className="col-12 col-md-6 text-center">
                <label className="form-label" style={{ width: "90%" }}>
                  タイトル
                  <input
                    style={{
                      background: theme == "#F8F9FA" ? "#F8F9FA" : "#1E1E1E",
                      color: theme == "#F8F9FA" ? "#1E1E1E" : "#F8F9FA",
                    }}
                    className="form-control"
                    type="text"
                    onChange={handleTitleChange}
                  />
                </label>
              </div>
              <div className="row">
                <div className="col-12 col-md-6 text-center">
                  <label className="form-label" style={{ width: "100%" }}>
                    サムネイル
                    <input
                      style={{
                        background: theme == "#F8F9FA" ? "#F8F9FA" : "#1E1E1E",
                        color: theme == "#F8F9FA" ? "#1E1E1E" : "#F8F9FA",
                      }}
                      className="form-control"
                      type="file"
                      accept="image/jpeg,image/gif,image/png"
                      onChange={handleThumbnailChange}
                    />
                  </label>
                </div>
                <div className="col-12 col-md-6 text-center">
                  <label className="form-label" style={{ width: "100%" }}>
                    画像
                    <input
                      style={{
                        background: theme == "#F8F9FA" ? "#F8F9FA" : "#1E1E1E",
                        color: theme == "#F8F9FA" ? "#1E1E1E" : "#F8F9FA",
                      }}
                      className="form-control"
                      type="file"
                      multiple
                      accept="image/jpeg,image/gif,image/png"
                      onChange={handleImagesChange}
                    />
                  </label>
                </div>
              </div>
            </form>
            <div className="row mt-2 d-flex justify-content-center">
              {image && (
                <div className="col-12 col-sm-6 col-md-3">
                  <Preview
                    src={window.URL.createObjectURL(image)}
                    icon={false}
                  />
                </div>
              )}
            </div>
          </>
        </div>
      </div>
      {width >= 768 && name ? (
        <div
          className="row text-center"
          style={{
            marginRight: "8px",
            marginLeft: "8px",
            marginBottom: "32px",
          }}
        >
          <div className="d-flex align-items-stretch">
            <div className={`col-12 col-md-6`}>
              <label className="form-label">
                本文
                <div style={{ width: "100%", height: "100%" }}>
                  <textarea
                    style={{
                      background: theme == "#F8F9FA" ? "#F8F9FA" : "#1E1E1E",
                      color: theme == "#F8F9FA" ? "#1E1E1E" : "#F8F9FA",
                    }}
                    className="form-control"
                    onChange={handleContentChange}
                    cols={100}
                    rows={50}
                    value={content}
                  />
                </div>
              </label>
            </div>
            <div className="col-12 col-md-6">
              プレビュー
              <div
                className={`${style.whitespace} ${style.markdown_preview} ${style.borderPreview}`}
                style={{
                  width: "100%",
                  height: "97.5%",
                  background: theme == "#F8F9FA" ? "#F8F9FA" : "#1E1E1E",
                  color: theme == "#F8F9FA" ? "#1E1E1E" : "#F8F9FA",
                }}
              >
                <Markdown content={content} />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-primary" onClick={handleSubmit}>
              投稿
            </button>
          </div>
        </div>
      ) : (
        <div
          className="row text-center"
          style={{
            marginRight: "8px",
            marginLeft: "8px",
            marginBottom: "32px",
          }}
        >
          <div className={`col-12 col-md-6`}>
            <label className="form-label">
              Content
              <div style={{ width: "100%", height: "100%" }}>
                <textarea
                  className="form-control"
                  style={{
                    width: "100%",
                    height: "97.5%",
                    background: theme == "#F8F9FA" ? "#F8F9FA" : "#1E1E1E",
                    color: theme == "#F8F9FA" ? "#1E1E1E" : "#F8F9FA",
                  }}
                  onChange={handleContentChange}
                  cols={100}
                  rows={50}
                  value={content}
                ></textarea>
              </div>
            </label>
          </div>
          <div className="col-12 col-md-6">
            Preview
            <div
              className={`${style.whitespace} ${style.markdown_preview} ${style.borderPreview}`}
              style={{ width: "100%", height: "97.5%" }}
            >
              <Markdown content={content} />
            </div>
          </div>
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "32px" }}
          >
            <button className="btn btn-primary" onClick={handleSubmit}>
              投稿
            </button>
          </div>
        </div>
      )}
    </>
  );
}
