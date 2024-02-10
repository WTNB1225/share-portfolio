"use client";
import axios from "axios";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus";
import { useGetCsrfToken } from "@/hook/useGetCsrfToken";
import { useWindowWidth } from "@/hook/useWindowWidth";
import Cookies from "js-cookie";
import Preview from "@/components/Preview";
import Markdown from "@/components/Markdown";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import style from "./page.module.css";

export default function PostEdit() {
  const [loading, setLoading] = useState(true); //ログイン状態の確認中かどうか
  const [token, setToken] = useState(""); //CSRFトークン
  const [name, setName] = useState(""); //ログインしたユーザー名
  const [title, setTitle] = useState(""); //投稿のタイトル
  const [content, setContent] = useState(""); //投稿の内容
  const [url, setUrl] = useState<File[]>([]); //サムネイルのURL
  const [error, setError] = useState(""); //エラーメッセージ
  const [theme, setTheme] = useState(Cookies.get("theme") || "#F8F9FA"); //テーマの設定

  const pathname = usePathname();
  const username = pathname.split("/").reverse()[2]; //URLからユーザー名を取得
  const id = pathname.split("/").reverse()[1]; //URLから投稿IDを取得

  const router = useRouter();

  const { data, isLoading } = useCheckLoginStatus(); //{data: ログインしたユーザーの情報, isLoading: data取得中かどうか}
  useEffect(() => {
    if (isLoading == false) {
      if (data) {
        setName(data.name!);
      }
      setLoading(false); //dataの取得完了
    }
  }, [data, isLoading]);

  const csrfToken = useGetCsrfToken(); //CSRFトークンを取得するカスタムフック
  useEffect(() => {
    setToken(csrfToken);
  }, [csrfToken]);

  const width = useWindowWidth(); //画面の幅を取得するカスタムフック

  const getPost = async (id: string) => {
    //投稿の情報を取得する関数
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/post/${id}`
      );
      if (response.data) {
        setTitle(response.data.title);
        setContent(response.data.content);
      }
    } catch (e) {
      setError("投稿が存在しません"); //エラーメッセージ
      return;
    }
  };

  useEffect(() => {
    getPost(id);
  }, [id]);

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
      const files = Array.from(e.target.files);
      files.forEach(async (file) => {
        //画像を1つずつアップロード
        if (file.size > 5 * 1024 * 1024) {
          setError("5MB以下の画像を選択してください");
        } else {
          setError("");
          await S3.send(
            new PutObjectCommand({
              Bucket: process.env.NEXT_PUBLIC_CLOUDFLARE_BUCKET as string,
              Key: file.name,
              Body: file,
              ContentType: file.type,
            })
          );
        }
      });
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
    const formData = new FormData();
    formData.append("post[title]", title);
    formData.append("post[content]", content);
    url.forEach((file) => formData.append("post[images][]", file));
    try {
      const response = axios.patch(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/posts/${username}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRF-Token": token,
          },
          withCredentials: true,
        }
      );
      router.push(`/post/${username}/${id}`);
    } catch (e: any) {
      setError(e.response.data);
      return;
    }
  };

  if (loading) return;

  if (username !== name) {
    return (
      <div>
        <Header />
        <h1 className="text-center" style={{ marginTop: "32px" }}>
          あなたはこのページを見ることはできません
        </h1>
      </div>
    );
  }

  return (
    <>
      <Header />
      {error && (
        <div className="alert alert-danger" role="alert">
          <div>{error}</div>
        </div>
      )}
      <div
        className="container d-flex justify-content-center"
        style={{ marginTop: "32px" }}
      >
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
                    value={title}
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
              {url[0] && (
                <div className="col-12 col-sm-6 col-md-3">
                  <Preview
                    src={window.URL.createObjectURL(url[0])}
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
