import style from './page.module.css';
import Header from "../components/Header";
import Link from 'next/link';

export default function Home() {
  return (
    <div className={style.margin}>
      <Header />
      <div className={style.container}>
        <h1 className={style.title}>作品共有サービスへようこそ</h1>
        <p className={style.description}>このサイトではプログラミングの作品を共有することができます</p>
        <div className={style.link}>
          <Link href="/signup">
            今すぐ登録
          </Link>
          <Link href="/login">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}