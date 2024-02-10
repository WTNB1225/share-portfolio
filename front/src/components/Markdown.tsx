"use client";
import React, { ClassAttributes, HTMLAttributes } from "react";
import ReactMarkdown, { ExtraProps } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import gfm from "remark-gfm";
import style from "@/styles/Markdown.module.css";

//react-markdownではcodeblockに背景色,文字に色がつかないのでカスタムする
const code = ({
  className,
  children,
}: ExtraProps &
  ClassAttributes<HTMLElement> &
  HTMLAttributes<HTMLPreElement>) => {
  const fileName = className?.split(":")[1]; //classnameからファイル名を取得
  return (
    <>
      <div
        style={{
          backgroundColor: "#2b2b2b",
          color: "white",
          borderRadius: "0.25rem",
        }}
        className={style.width}
      >
        <span>{"  "}</span>
        <span className={style.filename}>{fileName}</span>
        <SyntaxHighlighter
          language={className?.split(":")[0].replace("language-", "")} //classnameからプログラミング言語を取得
          style={a11yDark}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    </>
  );
};

//カスタムしたMarkdownを返す
export default function Markdowns({ content }: { content: string }) {
  return (
    <ReactMarkdown
      className={style.whitespace}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      remarkPlugins={[gfm]}
      components={{ code: code }}
    >
      {content}
    </ReactMarkdown>
  );
}
