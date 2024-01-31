import style from './page.module.css';
import Header from "../components/Header";
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Header />
      <div className="container" style={{marginTop:"32px"}}>
        <div className="row justify-content-center">
          <div className="col-xs-12 col-md-8 text-center">
            <h1>share portfolioへようこそ</h1>
            <p>このサイトではプログラミングの作品を共有することができます</p>
          </div>
        </div>
        <div className="row justify-content-center" style={{marginTop:"32px"}}>
          <div className="col-xs-6 col-md-4">
            <div className={style.link + " text-center"}>
              <Link href="/signup" className="btn btn-primary mb-4" >
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