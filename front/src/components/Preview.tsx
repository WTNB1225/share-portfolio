import Image from "next/image";

//iconの場合はborder-radiusを50%にする(円にする) r2に保存していない画像のpreview
export default function Preview({src, icon}:{src:string; icon:boolean}) {
  if(!icon) {
    return(
      <Image src={src} width={100} height={100} alt="preview" />
    )
  } else {
    return(
      <Image style={{borderRadius:"50%"}} src={src} width={100} height={100} alt="preview" />
    )
  }
}