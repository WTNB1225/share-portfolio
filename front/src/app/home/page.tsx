"use client";
import Header from "../../components/Header";
import { useCheckLoginStatus } from "../../hook/useCheckLoginStatus";

export default function App() {
  const {data, isLoading} = useCheckLoginStatus();

  return (
    <>
      {!isLoading && (
        <div>
          <Header />
          {data?.name ? (
            <h1 className="text-center" style={{marginTop:"32px"}}>Hello {data.name}</h1>
          ) : (
            <h1 className="text-center" style={{marginTop:"32px"}}>ログインしてください</h1>
          )}
        </div>
      )}
    </>
  );
}