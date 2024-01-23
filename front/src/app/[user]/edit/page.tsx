"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Header from "../../../components/Header";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { useCheckLoginStatus } from "../../../hook/useCheckLoginStatus";
import { useGetCsrfToken } from "../../../hook/useGetCsrfToken";

export default function Edit() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loginUser, setLoginUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState("");
  const [userLoading, setUserLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const splitPathname = pathname.split("/");
  const username = splitPathname[splitPathname.length - 2];


  useCheckLoginStatus().then((d) => {
    if (d) {
      setLoginUser(d.name);
    }
    setUserLoading(false);

  });

  useGetCsrfToken().then((token) => {
    if (token) {
      setCsrfToken(token);
      setLoading(false);
    }
  });

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };


  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmationChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirmation(e.target.value);
  };

  const handleNameSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user[name]", name);
    if (loginUser == username) {
      try {
        const response = await axios.patch(
          `http://localhost:3000/users/${username}`,
          formData,
          {
            headers: {
              "X-CSRF-Token": csrfToken,
            },
            withCredentials: true,
          }
        );
        try{
          const postData = new FormData();
          postData.append("post[username]", name);
          const postRes = await axios.patch(
            `http://localhost:3000/posts/${username}`,
            postData,
            {
              headers: {
                "X-CSRF-Token": csrfToken,
              },
              withCredentials: true,
            }
          )
          router.push(`/${name}`);
          console.log(postRes)
        } catch(e) {
          alert(e);
        }
      } catch (e) {
        alert(e);
      }
    } else {
      router.push("/401");
    }
  };
  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user[email]", email);
    if (loginUser == username) {
      try {
        const response = await axios.patch(
          `http://localhost:3000/users/${username}`,
          formData,
          {
            headers: {
              "X-CSRF-Token": csrfToken,
            },
            withCredentials: true,
          }
        );
        router.push(`/${username}`);
      } catch (e) {
        alert(e);
      }
    } else {
      router.push("/401");
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user[password]", password);
    formData.append("user[password_confirmation]", passwordConfirmation);
    if (loginUser == username) {
      try {
        const response = await axios.patch(
          `http://localhost:3000/users/${username}`,
          formData,
          {
            headers: {
              "X-CSRF-Token": csrfToken,
            },
            withCredentials: true,
          }
        );
        router.push(`/${username}`);
      } catch (e) {
        alert(e);
      }
    } else {
      router.push("/401");
    }
  };

  if (loading) {
    return;
  }

  if (loginUser !== username) {
    return (
      <div>
        <Header />
        <h1>401 Unauthorized</h1>
      </div>
    );
  }

  return (
    <>
    <Header />
    <div className="container d-flex justify-content-center vh-100 " style={{marginTop:"32px"}}>
      <div className="row">
        <div className="col-12 col-lg-8">
          <form className="mb-3">
            <label style={{width: '300px'}}>
              name
              <input type="text" onChange={handleNameChange} className="form-control" />
              <button onClick={handleNameSubmit} className="btn btn-primary mt-2">変更</button>
            </label>
          </form>
          <form className="mb-3">
            <label style={{width: '300px'}}>
              email
              <input type="text" onChange={handleEmailChange} className="form-control" />
              <button onClick={handleEmailSubmit} className="btn btn-primary mt-2">変更</button>
            </label>
          </form>
          <form className="mb-3">
            <label style={{width: '300px'}}>
              password
              <input type="text" onChange={handlePasswordChange} className="form-control mb-3" />
              password confirmation
              <input type="text" onChange={handlePasswordConfirmationChange} className="form-control" />
              <button onClick={handlePasswordSubmit} className="btn btn-primary mt-2">変更</button>
            </label>
          </form>
        </div>
      </div>
    </div>
  </>
  );
}
