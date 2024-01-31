"use client";
import axios from "axios";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckLoginStatus } from "@/hook/useCheckLoginStatus"; 
import Cookies from "js-cookie";
import Header from "../../components/Header";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  const [theme, setTheme] = useState(Cookies.get("theme") || "#F8F9FA"); //テーマの設定
  
  const { data, isLoading } = useCheckLoginStatus();//ログイン状態を管理

  //inputの値をstateに格納
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRemember(remember * -1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("session[email]", email);
    formData.append("session[password]", password);
    formData.append("session[remember_me]", remember.toString());

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/login`,
        formData,
        {
          withCredentials: true,
        }
      );
      const token = response.data.token;
      localStorage.setItem("jwt", token);
      router.push("/home");
    } catch (e) {
      setError("メールアドレスかパスワードが間違っています");
      return;
    }
  };

  //ログインしている状態でアクセスしたらhomeに飛ばす
  useEffect(() => {
    if(!isLoading && data) {
      router.replace("/home");
    }
    if(!isLoading && !data) {
      setLoading(false);
    }
  }, [isLoading, data]);

  if(loading) {
    return;
  }
  return (

    <>
      <Header />
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="container d-flex justify-content-center" style={{marginTop:"32px"}}>
        <div className="row">
          <div className="col-12 col-lg-8">
            <form className="mb-3" onSubmit={handleSubmit}>
              <div>
                <label className="form-label" style={{width: '300px'}}>
                  Email
                  <input type="text" onChange={handleEmailChange} className="form-control" style={{background: theme == "#F8F9FA" ? "#F8F9FA" : "#1E1E1E",color: theme == "#F8F9FA" ? "#1E1E1E" : "#F8F9FA",}} />
                </label>
              </div>
              <div>
                <label className="form-label" style={{width: '300px'}}>
                  Password
                  <input type="password" onChange={handlePasswordChange} className="form-control" style={{background: theme == "#F8F9FA" ? "#F8F9FA" : "#1E1E1E",color: theme == "#F8F9FA" ? "#1E1E1E" : "#F8F9FA",}} />
                </label>
              </div>
              <div>
                <label className="form-check-label" style={{width: '300px'}}>
                  Remember
                  <input type="checkbox" onChange={handleCheckboxChange} className="form-check-input mb-3"  />
                </label>
              </div>
              <div>
                <button type="submit" className="btn btn-primary">ログイン</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
