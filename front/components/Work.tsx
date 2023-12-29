import Link from "next/link";
import Image from "next/image";

export default function Work({
  id,
  name,
  title,
  image
}:{
  id:string,
  name:string,
  title:string,
  image:string
}) {
  return(
    <div>
      <Link href={`post/${id}`}></Link>
    </div>
  )
}