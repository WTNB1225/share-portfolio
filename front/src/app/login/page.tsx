"use client";

import axios from "axios";
import {useState, ChangeEvent, FormEvent} from "react"
import { useRouter } from "next/navigation";

export default function Login() {

  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<number>(-1);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e:ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const handleCheckboxChange = (e:ChangeEvent<HTMLInputElement>) => {
    setRemember(remember * -1);
  }

  const handleSubmit = async(e: FormEvent) => {
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
            withCredentials: true
          }
        );
        console.log(response);
        router.push("/home");
    } catch(e) {
      alert(e);
      console.log(e);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="text" onChange={handleEmailChange}/>
        </label>
        <label>
          Password
          <input type="text" onChange={handlePasswordChange}/>
        </label>
        <label>
          Remember
          <input type="checkbox" onChange={handleCheckboxChange}/>
        </label>
        <button type="submit">ログイン</button>
      </form>
    </div>
  )
}