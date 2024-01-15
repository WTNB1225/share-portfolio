"use client";
import {  useState } from "react";
import Header from "../../components/Header";
import { useCheckLoginStatus } from "../../hook/useCheckLoginStatus";

export default function App() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useCheckLoginStatus().then((d) => {
    if (d) {
      if (d.name) {
        setName(d.name);
      } else {
        setName("guest");
      }
    }
    setLoading(false);
  });
  return (
    <>
      {loading == false && (
        <>
          <Header />
          <h1>Hello {name}</h1>
        </>
      )}
    </>
  );
}
