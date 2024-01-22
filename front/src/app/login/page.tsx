"use client";
import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(-1);
  

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
        "http://localhost:3000/login",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      router.push("/home");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center" style={{marginTop:"32px"}}>
        <div className="row">
          <div className="col-12 col-lg-8">
            <form className="mb-3" onSubmit={handleSubmit}>
              <div>
                <label className="form-label" style={{width: '300px'}}>
                  Email
                  <input type="text" onChange={handleEmailChange} className="form-control" />
                </label>
              </div>
              <div>
                <label className="form-label" style={{width: '300px'}}>
                  Password
                  <input type="password" onChange={handlePasswordChange} className="form-control" />
                </label>
              </div>
              <div>
                <label className="form-check-label" style={{width: '300px'}}>
                  Remember
                  <input type="checkbox" onChange={handleCheckboxChange} className="form-check-input mb-3" />
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
