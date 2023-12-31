/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import axios from "axios"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Header from "../../../../../components/Header"
import Image from "next/image"

type Data = {
  images_url:string[]
  title:string,
  content:string,
  id:string,
  username:string
}                        

export default function PostId() {
  const pathname = usePathname();
  const splitpathname = pathname.split("/")
  const id = splitpathname[splitpathname.length - 1]
  const [data, setData] = useState<Data[]>([]);
  const [url, setUrl] = useState<string[]>([]);
  //console.log(id)

  const getPostById = async(id:string) => {
    try{
      const response = await axios.get(`http://localhost:3000/post/${id}`);
      setData(response.data)
      setUrl(response.data.images_url)
      console.log(response.data)
    } catch(e){
      alert(e);
    }
  }

  useEffect(() => {
    getPostById(id);
  },[]);

  console.log(data)

  return(
    <>
      <Header/>
      {url.map((image, index) => {
        return(
          <Image key={index} alt="" src={image} width={400} height={300}/>          
        )
      })}
    </>
  )
}