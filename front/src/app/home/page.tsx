"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { useCheckLoginStatus } from "../../hook/useCheckLoginStatus";

export default function App() {
  const [name, setName] = useState("");

  useCheckLoginStatus().then((d) => {
    console.log(d);
    if (d) {
      setName(d.name);
    }
  });
  return (
    <>
      <Header />
      <h1>Hello {name}</h1>
    </>
  );
}
