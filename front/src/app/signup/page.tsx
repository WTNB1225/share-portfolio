"use client";
import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Preview from "../../components/Preview";

type Signup = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  avatar: File[];
};

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [avatar, setAvatar] = useState<File[]>([]);
  const [error, setError] = useState(); //バリデーションエラーを設定

  //inputの値をstateに格納
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmation = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(e.target.value);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatar(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user[name]", name);
    formData.append("user[email]", email);
    formData.append("user[password]", password);
    formData.append("user[password_confirmation]", passwordConfirmation);
    avatar.forEach((img) => {
      formData.append("user[avatar]", img);
    });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/users`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      const token = response.data.token;
      localStorage.setItem('jwt',token);
      router.push("/home");
    } catch (e: any) {
      console.log(e)
      setError(e.response.data);
      return;
    }
  };
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
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <form className={`mb-3`} onSubmit={handleSubmit}>
              <div>
                <label className="form-label" style={{ width: "300px" }}>
                  name
                  <input
                    type="text"
                    onChange={handleNameChange}
                    className="form-control"
                  />
                </label>
              </div>
              <div>
                <label className="form-label" style={{ width: "300px" }}>
                  email
                  <input
                    type="text"
                    onChange={handleEmailChange}
                    className="form-control"
                  />
                </label>
              </div>
              <div>
                <label className="form-label" style={{ width: "300px" }}>
                  avatar
                  <input
                    className="form-control"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div>
                <label className="form-label" style={{ width: "300px" }}>
                  password
                  <input
                    type="password"
                    onChange={handlePasswordChange}
                    className="form-control"
                  />
                </label>
              </div>
              <div>
                <label className="form-label" style={{ width: "300px" }}>
                  password confirmation
                  <input
                    type="password"
                    onChange={handlePasswordConfirmation}
                    className="form-control"
                  />
                </label>
              </div>
              <div>
                <button type="submit" className="btn btn-primary">
                  登録
                </button>
              </div>
            </form>
            {avatar[0] && (
              <div>
                <Preview src={URL.createObjectURL(avatar[0])} icon={true} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
