"use client";
import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import { useCheckLoginStatus } from "../../../hook/useCheckLoginStatus";
import { useGetCsrfToken } from "../../../hook/useGetCsrfToken";
import Preview from "@/components/Preview";
import Markdown from "@/components/Markdown";
import style from "./page.module.css";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

export default function PostNew() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File>();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState("");
  const [avatar, setAvatar] = useState("");
  dotenv.config();

  useCheckLoginStatus().then(async (d) => {
    if (d) {
      setId(d.id);
      setName(d.name);
      const res = await axios.get(`http://localhost:3000/users/${name}`);
      setAvatar(res.data.avatar_url);
      setLoading(false);
    }
  });

  useGetCsrfToken().then((token) => {
    if (token) {
      setCsrfToken(token);
      setLoading(false);
    }
  });

  const S3 = new S3Client({
    region: "auto",
    endpoint: process.env.NEXT_PUBLIC_CLOUDFLARE_ENDPOINT as string,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCESS_KEY as string,
    },
  });

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleThumbnailChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      setImage(files[0]);
    }
  };

  const handleImagesChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach(async (file) => {
        await S3.send(
          new PutObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_CLOUDFLARE_BUCKET as string,
            Key: file.name,
            Body: file,
            ContentType: file.type,
          })
        );
        const encodedFileName = encodeURIComponent(file.name);
        const imageUrl = `![${file.name}](https://pub-a05d828609984db8b2239cd099a20aac.r2.dev/${encodedFileName})`;
        setContent((prevContent) => prevContent + "\n" + imageUrl);
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
        "http://localhost:3000/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRF-Token": csrfToken, // ヘッダーにCSRFトークンを追加
          },
          withCredentials: true,
        }
      );
      console.log(response);
      router.push("/post");
    } catch (error) {
      alert(error);
    }
  };

  if (loading) {
    return <></>;
  }

  return (
    <>
      <Header />
      <div
        className="container d-flex justify-content-center"
        style={{ marginTop: "32px" }}
      >
        <div className="col-12 col-lg-8">
          {name ? (
            <>
              <form
                className="row g-3 justify-content-center"
              >
                <div className="col-12 col-md-6 text-center">
                  <label className="form-label">
                    Title
                    <input
                      style={{width:"100%"}}
                      className="form-control"
                      type="text"
                      onChange={handleTitleChange}
                    />
                  </label>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6 text-center">
                    <label className="form-label">
                      サムネイル
                      <input
                        className="form-control"
                        type="file"
                        accept="image/jpeg,image/gif,image/png"
                        onChange={handleThumbnailChange}
                      />
                    </label>
                  </div>
                  <div className="col-12 col-md-6 text-center">
                    <label className="form-label">
                      画像
                      <input
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
          ) : (
            <div>
              <p>ログインしてください</p>
            </div>
          )}
        </div>
      </div>
      {name &&(
        <div className="row text-center" style={{marginRight:"8px", marginLeft:"8px", marginBottom:"32px"}}>
          <div className={`col-12 col-md-6`}>
            <label className="form-label">
              Content
              <div style={{width:"100%", height:"100%"}}>
              <textarea
                className="form-control"
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
              style={{width:"100%", height:"97.5%"}}
            >
              <Markdown content={content} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
