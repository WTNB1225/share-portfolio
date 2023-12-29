import Image from "next/image"
import Link from "next/link"

export default function UserWork({
  id,
  name,
  title,
  image
}: {
  id:string,
  name:string,
  title:string,
  image:string
}) {
  return(
    <div>
      <Link href={`/post/${name}/${id}`}>
        <Image
          alt=""
          src={image}
          height={300}
          width={400}
        />
      <div>
        <h2>{title}</h2>
      </div>
      </Link>
    </div>
  )
}