"use client";
import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import { useCheckLoginStatus } from "../../../hook/useCheckLoginStatus";
import { useGetCsrfToken } from "../../../hook/useGetCsrfToken";
import Preview from "@/components/Preview";

export default function PostNew() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImages] = useState<File>();
  const [image2, setImages2] = useState<File>();
  const [image3, setImages3] = useState<File>();
  const [image4, setImages4] = useState<File>();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState("");
  const [avatar, setAvatar] = useState("");

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

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      setImages(files[0]);
    }
  };

  const handleFile2Change = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      setImages2(files[0]);
    }
  };

  const handleFile3Change = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      setImages3(files[0]);
    }
  };

  const handleFile4Change = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      setImages4(files[0]);
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
    if (image) {
      formData.append("post[images][]", image);
    }
    if (image2) {
      formData.append("post[images][]", image2);
    }
    if (image3) {
      formData.append("post[images][]", image3);
    }
    if (image4) {
      formData.append("post[images][]", image4);
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
        <div>
          {name ? (
            <>
              <div>
                <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-12 text-center">
                    <label className="form-label">
                      Title
                      <input
                        className="form-control"
                        type="text"
                        onChange={handleTitleChange}
                      />
                    </label>
                  </div>
                  <div className="col-12 text-center">
                    <label className="form-label">
                      Content
                      <textarea
                        className="form-control"
                        onChange={handleContentChange}
                      />
                    </label>
                  </div>
                  <div className="col-12 text-center">
                    <label className="form-label">
                      Image1
                      <input
                        className="form-control"
                        type="file"
                        accept="image/jpeg,image/gif,image/png"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <div className="col-12 text-center">
                    <label className="form-label">
                      Image2
                      <input
                        className="form-control"
                        type="file"
                        accept="image/jpeg,image/gif,image/png"
                        onChange={handleFile2Change}
                      />
                    </label>
                  </div>
                  <div className="col-12 text-center">
                    <label className="form-label">
                      Image3
                      <input
                        className="form-control"
                        type="file"
                        accept="image/jpeg,image/gif,image/png"
                        onChange={handleFile3Change}
                      />
                    </label>
                  </div>
                  <div className="col-12 text-center">
                    <label className="form-label">
                      Image
                      <input
                        className="form-control"
                        type="file"
                        accept="image/jpeg,image/gif,image/png"
                        onChange={handleFile4Change}
                      />
                    </label>
                  </div>
                  <div className="col-12 text-center">
                    <button type="submit" className="btn btn-primary">
                      投稿
                    </button>
                  </div>
                </form>
                　　　　　　
              </div>
              <div className="row mt-2 d-flex justify-content-center">
                {image && (
                  <div className="col-6 col-sm-3">
                    <Preview src={window.URL.createObjectURL(image)} icon={false}/>
                  </div>
                )}
                {image2 && (
                  <div className="col-6 col-sm-3 ">
                    <Preview src={window.URL.createObjectURL(image2)} icon={false}/>
                  </div>
                )}
                {image3 && (
                  <div className="col-6 col-sm-3 ">
                    <Preview src={window.URL.createObjectURL(image3)} icon={false} />
                  </div>
                )}
                {image4 && (
                  <div className="col-6 col-sm-3 ">
                    <Preview src={window.URL.createObjectURL(image4)} icon={false}/>
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
    </>
  );
}
