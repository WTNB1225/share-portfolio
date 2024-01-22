import Image from "next/image";

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