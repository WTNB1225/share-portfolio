"use client";
import {  useState } from "react";
import Header from "../../components/Header";
import { useCheckLoginStatus } from "../../hook/useCheckLoginStatus";

export default function App() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useCheckLoginStatus().then((d) => {
    if (d) {
      setName(d.name);
    } else {
      setName("guest");
    }
    setLoading(false);
  });

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
