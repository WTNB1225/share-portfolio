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
            <>
              <h1 className="text-center" style={{marginTop:"32px"}}>あなたはまだログインしていません</h1>
              <h1 className="text-center" style={{marginTop:"16px"}}>ログインすると投稿,コメントなどの機能を使用できます</h1>
            </>
          )}
        </div>
      )}
    </>
  );
}