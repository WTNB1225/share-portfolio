import style from "./page.module.css";
import Header from "../components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="container" style={{ marginTop: "32px" }}>
        <div className="row justify-content-center">
          <div className="col-xs-12 col-md-8 text-center">
            <h1>Share Portfolioへようこそ</h1>
            <p style={{ marginTop: "32px" }}>
              このサイトではプログラミングの作品を公開,共有することができます
            </p>
            <p>
              Cookieを使用できない環境では投稿やいいね、コメントができません
            </p>
            <h1>お知らせ</h1>
            <p>
              画像の保存先を変更した都合上、一部のアイコンが表示されなくなっています
            </p>
            <p>お手数おかけしますが、もう一度編集画面から選択してください</p>
          </div>
        </div>
        <div
          className="row justify-content-center"
          style={{ marginTop: "32px" }}
        >
          <div className="col-xs-6 col-md-4">
            <div className={style.link + " text-center"}>
              <Link href="/signup" className="btn btn-primary mb-4">
                今すぐ登録
              </Link>
              <Link href="/login" className="btn btn-primary mb-4">
                ログイン
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
