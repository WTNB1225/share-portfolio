"use client";

import axios from "axios";
import {useState, ChangeEvent, FormEvent} from "react"
import { useRouter } from "next/navigation";

export default function Login() {

  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e:ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const handleSubmit = async(e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("session[email]", email);
    formData.append("session[password]", password);

    try {
        const response = await axios.post(
          "http://localhost:3000/login",
          formData,
          {
            withCredentials: true
          }
        );
        console.log(response);
        router.push("/");
    } catch(e) {
      alert(e);
      console.log(e);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          email
          <input type="text" onChange={handleEmailChange}/>
        </label>
        <label>
          password
          <input type="text" onChange={handlePasswordChange}/>
        </label>
        <button type="submit">ログイン</button>
      </form>
    </div>
  )
}