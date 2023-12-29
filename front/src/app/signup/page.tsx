'use client'

import axios from "axios";
import { ChangeEvent, FormEvent, useState} from "react"
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";

export default function Signup() {

  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  
  const handleNameChange = (e:ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  const handleEmailChange = (e:ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e:ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const handlePasswordConfirmation = (e:ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(e.target.value);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user[name]", name);
    formData.append("user[email]", email);
    formData.append("user[password]", password);
    formData.append("user[password_confirmation]", passwordConfirmation)
    try{
      const response = await axios.post(
        "http://localhost:3000/users",
        formData,
        {
          withCredentials: true
        }
      );
      console.log(response)
      router.push("/")
    } catch(e) {
      alert(e)
    }
  }

  return (
    <>
    <Header/>
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          name
          <input type="text" onChange={handleNameChange}/>
        </label>
        <label>
          email
          <input type="text" onChange={handleEmailChange}/>
        </label>
        <label>
          password
          <input type="text" onChange={handlePasswordChange}/>
        </label>
        <label>
          password confirmation
          <input type="text" onChange={handlePasswordConfirmation}/>
        </label>   
        <button type="submit">登録</button>
      </form>
    </div>
    </>
  )
}