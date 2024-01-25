"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useCheckLoginStatus } from "../../hook/useCheckLoginStatus";

export default function App() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const {data, isLoading} = useCheckLoginStatus();
  useEffect(() => {
    if (isLoading == false) {
      setName(data?.name!);
      setLoading(false);
    }
  }, [data, isLoading]);

  return (
    <>
      {loading === false && (
        <div>
          <Header />
          {name === "guest" ? (
            <p>ログインしてください</p>
          ) : (
            <>
              <h1>Hello {name}</h1>
            </>
          )}
        </div>
      )}
    </>
  );
}
