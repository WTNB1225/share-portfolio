"use client"
import React, { ClassAttributes, HTMLAttributes } from 'react'
import ReactMarkdown, { ExtraProps } from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {a11yDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import gfm from 'remark-gfm'
import style from "@/styles/Markdown.module.css"

const code = ({className, children}: ExtraProps & ClassAttributes<HTMLElement> & HTMLAttributes<HTMLPreElement>) => {
  const fileName = className?.split(":")[1]
  console.log(className?.split(":")[0].replace("language-", ""))
  return(
    <>
    <div style={{backgroundColor:"#2b2b2b", color:"white", borderRadius:"0.25rem"}}>
    <span>{"  "}</span><span className={style.filename} >{fileName}</span>
    <SyntaxHighlighter
      language={className?.split(":")[0].replace("language-", "")}
      style={a11yDark}
    >
      { String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
    </div>
    </>
  )
}


export default function Markdowns({content}: {content:string}) {
  return(
    <ReactMarkdown className={style.whitespace} rehypePlugins={[rehypeRaw, rehypeSanitize]} remarkPlugins={[gfm]} components={{code:code}}>{content}</ReactMarkdown>
  )
}