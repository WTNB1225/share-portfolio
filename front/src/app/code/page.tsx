"use client"
import React, { ClassAttributes, HTMLAttributes } from 'react'
import ReactMarkdown, { ExtraProps } from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {a11yDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import style from "./page.module.css"  

const markdown = `
\`\`\`js:script.js
console.log('It works!')
\`\`\`
`

const code = ({ className, children}: ExtraProps & ClassAttributes<HTMLElement> & HTMLAttributes<HTMLPreElement>) => {
  const fileName = className?.split(":")[1]
  return(
    <>
    <div style={{backgroundColor:"#2b2b2b", color:"white", fontFamily:"YakuHanJPs"}}>
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


export default function Markdowns(){
  return(
    <ReactMarkdown className={style.md} components={{code:code}}>{markdown}</ReactMarkdown>
  )
}

