"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Header from "../../../components/Header";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { useCheckLoginStatus } from "../../../hook/useCheckLoginStatus";
import { useGetCsrfToken } from "../../../hook/useGetCsrfToken";
import { useEditState } from "@/hook/useEditState"; //editのstateを纏めたカスタムフック

export default function Edit() {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    passwordConfirmation, setPasswordConfirmation,
    loginUser, setLoginUser,
    loading, setLoading,
    token, setToken,
    userLoading, setUserLoading,
    postDatas, setPostDatas,
    error, setError
  } = useEditState(); 

  const router = useRouter();

  const pathname = usePathname();
  const username = pathname.split("/").reverse()[1]; //URLからユーザー名を取得

  const {data, isLoading} = useCheckLoginStatus(); //{data: ログインしたユーザーの情報, isLoading: data取得中かどうか}
  useEffect(() => {
    if (isLoading == false) {
      setLoginUser(data?.name!);
      setUserLoading(false); //userdataの取得完了
    }
  }, [data, isLoading]);

  const csrfToken = useGetCsrfToken();
  useEffect(() => {
    setToken(csrfToken); 
    setLoading(false); //CSRFトークンの取得完了
  }, [csrfToken]);
  

  useEffect(() => {
    //ユーザーの投稿を取得する関数, postのusernameを変更するため
    async function fetchPosts(username: string)  {
      try {
        const response = await axios.get(`http://localhost:3000/posts/${username}`);
        if(response.data) {
          setPostDatas(response.data);
        }
      } catch (e:any) {
        alert(e)
        return;
      }
    }
    fetchPosts(username);
  },[username])


  //inputの値を取得する関数
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  //inputの値を取得する関数
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  //inputの値を取得する関数
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  //inputの値を取得する関数
  const handlePasswordConfirmationChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirmation(e.target.value);
  };

  //submit時の処理
  const handleNameSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user[name]", name);
    if (loginUser == decodeURIComponent(username)){ //特殊文字も正しく判定するためにdecodeURIComponentを使用
      try {
        const response = await axios.patch(
          `http://localhost:3000/users/${decodeURIComponent(username)}`,
          formData,
          {
            headers: {
              "X-CSRF-Token": token,
            },
            withCredentials: true,
          }
        );
        try{
          if(postDatas.length >= 1) { //投稿がある場合はpostのusernameも変更する
            for(let i = 0; i < postDatas.length; i++) {
              const postData = new FormData();
              postData.append("post[username]", name);
              const postRes = await axios.patch(
                `http://localhost:3000/posts/${decodeURIComponent(username)}`,
                postData,
                {
                  headers: {
                    "X-CSRF-Token": token,
                  },
                  withCredentials: true,
                }
              )
            } 
            router.push(`/${name}`); //プロフィールへ遷移
          }
        } catch(e) {
          return;
        }
      } catch (e:any) {
        //エラーメッセージを取得
        setError(e.response.data);
        return;
      }
    } else {
      router.push("/401");
    }
  };

  //handleNameSubmitと同様
  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user[email]", email);
    if (loginUser == decodeURIComponent(username)) {
      try {
        const response = await axios.patch(
          `http://localhost:3000/users/${decodeURIComponent(username)}`,  
          formData,
          {
            headers: {
              "X-CSRF-Token": token,
            },
            withCredentials: true,
          }
        );
        router.push(`/${username}`);
      } catch (e:any) {
        setError(e.response.data);
        return;
      }
    } else {
      router.push("/401");
    }
  };

  //handleNameSubmitと同様
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user[password]", password);
    formData.append("user[password_confirmation]", passwordConfirmation);
    if (loginUser == decodeURIComponent(username)) {
      try {
        const response = await axios.patch(
          `http://localhost:3000/users/${decodeURIComponent(username)}`,
          formData,
          {
            headers: {
              "X-CSRF-Token": token,
            },
            withCredentials: true,
          }
        );
        //router.push(`/${username}`);
      } catch (e:any) {
        setError(e.response.data);
        return;
      }
    } else {
      router.push("/401");
    }
  };

  //どちらかがloading中の場合は何も表示しない
  if (loading || userLoading) {
    return;
  }

  //自分以外が見ようとすると401
  if (loading == userLoading == false && loginUser !== decodeURIComponent(username)) {
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
    {error && (
        <div className="alert alert-danger" role="alert">
          {Object.entries(error).map(([key, value]) => (
            <div key={key}>{`${key}: ${value}`}</div>
          ))}
        </div>
      )}
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
