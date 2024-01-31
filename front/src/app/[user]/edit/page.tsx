"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Header from "../../../components/Header";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { useCheckLoginStatus } from "../../../hook/useCheckLoginStatus";
import { useGetCsrfToken } from "../../../hook/useGetCsrfToken";
import { useEditState } from "@/hook/useEditState"; //editのstateを纏めたカスタムフック
import Preview from "@/components/Preview";

export default function Edit() {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    passwordConfirmation, setPasswordConfirmation,
    avatar, setAvatar,
    loginUser, setLoginUser,
    loading, setLoading,
    token, setToken,
    userLoading, setUserLoading,
    postDatas, setPostDatas,
    error, setError,
    theme, setTheme,
    profile, setProfile,
    error2, setError2,
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}/posts/${username}`);
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

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      setAvatar(Array.from(e.target.files) as File[]);
    }
  }

  const handleProfileChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setProfile(e.target.value);
  }

  //submit時の処理 まとめて送信すると空文字が送信されてしまうため、それぞれのsubmitを分けている
  const handleNameSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user[name]", name);
    if (loginUser == decodeURIComponent(username)){ //特殊文字も正しく判定するためにdecodeURIComponentを使用
      try {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/users/${decodeURIComponent(username)}`,
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
                `${process.env.NEXT_PUBLIC_ENDPOINT}/posts/${decodeURIComponent(username)}`,
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
          `${process.env.NEXT_PUBLIC_ENDPOINT}/users/${decodeURIComponent(username)}`,  
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
          `${process.env.NEXT_PUBLIC_ENDPOINT}/users/${decodeURIComponent(username)}`,
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
    }
  };

  //avatarのsubmit時の処理x
  const handleAvatarSubmit = async(e:FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    avatar.forEach((blob: Blob) => {
      formData.append("user[avatar]", blob);
    });
    try{
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/users/${decodeURIComponent(username)}`,
        formData,
        {
          headers: {
            "X-CSRF-Token": token,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )
      router.push(`/${username}`);
    } catch(e:any) {
      setError2("変更する場合は画像を選択してください");
      return;
    }
  }

  const handleProfileSubmit = async(e:FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user[introduction]", profile);
    try{
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/users/${decodeURIComponent(username)}`,
        formData,
        {
          headers: {
            "X-CSRF-Token": token,
          },
          withCredentials: true,
        }
      )
      router.push(`/${username}`)
    } catch(e:any) {
      setError(e.response.data);
      return;
    }
  }

  //どちらかがloading中の場合は何も表示しない
  if (loading || userLoading) {
    return;
  }

  //自分以外が見ようとすると401
  if (loading == false && userLoading == false && loginUser !== decodeURIComponent(username)) {
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
    {error2 && (
        <div className="alert alert-danger" role="alert">
          {error2}
        </div>
    )}
    <div className="container d-flex justify-content-center vh-100 " style={{marginTop:"32px"}}>
      <div className="row">
        <div className="col-12 col-lg-8">
          <form className="mb-3">
            <label style={{width: '300px'}}>
              name
              <input type="text" onChange={handleNameChange} className="form-control" style={{background: theme == "#F8F9FA" ? "#F8F9FA" : "#1E1E1E",color: theme == "#F8F9FA" ? "#1E1E1E" : "#F8F9FA",}} />
              <button onClick={handleNameSubmit} className="btn btn-primary mt-2">変更</button>
            </label>
          </form>
          <form className="mb-3">
            <label style={{width: '300px'}}>
              email
              <input type="text" onChange={handleEmailChange} className="form-control" style={{background: theme == "#F8F9FA" ? "#F8F9FA" : "#1E1E1E",color: theme == "#F8F9FA" ? "#1E1E1E" : "#F8F9FA",}}/>
              <button onClick={handleEmailSubmit} className="btn btn-primary mt-2">変更</button>
            </label>
          </form>
          <form className="mb-3">
            <label style={{width: '300px'}}>
              password
              <input type="text" onChange={handlePasswordChange} className="form-control mb-3" style={{background: theme == "#F8F9FA" ? "#F8F9FA" : "#1E1E1E",color: theme == "#F8F9FA" ? "#1E1E1E" : "#F8F9FA",}}/>
              password confirmation
              <input type="text" onChange={handlePasswordConfirmationChange} className="form-control" style={{background: theme == "#F8F9FA" ? "#F8F9FA" : "#1E1E1E",color: theme == "#F8F9FA" ? "#1E1E1E" : "#F8F9FA",}} />
              <button onClick={handlePasswordSubmit} className="btn btn-primary mt-2">変更</button>
            </label>
          </form>
          <form className="mb-3">
            <label style={{width:"300px"}}>
              avatar
              <input type="file" onChange={handleAvatarChange} className="form-control" accept="image/jpeg,image/gif,image/png" style={{background: theme == "#F8F9FA" ? "#F8F9FA" : "#1E1E1E",color: theme == "#F8F9FA" ? "#1E1E1E" : "#F8F9FA"}}/>
              <button onClick={handleAvatarSubmit} className="btn btn-primary mt-2">変更</button>
            </label>
          </form>
          {avatar[0] && (
              <div>
                <Preview src={URL.createObjectURL(avatar[0])} icon={true} />
              </div>
            )}
          <form className="mb-3">
            <label style={{width:"300px"}}>
              プロフィール
              <textarea 
                className="form-control" 
                rows={15}
                onChange={handleProfileChange}
                style={{background: theme == "#F8F9FA" ? "#F8F9FA" : "#1E1E1E",color: theme == "#F8F9FA" ? "#1E1E1E" : "#F8F9FA"}}>   
              </textarea>
              <button className="btn btn-primary mt-2" onClick={handleProfileSubmit}>変更</button>
            </label>
          </form>
        </div>
      </div>
    </div>
  </>
  );
}
