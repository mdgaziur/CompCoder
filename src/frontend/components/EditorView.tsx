import MonacoEditor from "@monaco-editor/react";
import React from "react";
import { Sanitize, sanitizer } from "ts-html-sanitizer";

type problemDesc = {
  blocks: Array<any>;
  time: number;
  version: any;
};

type propsType = {
  problemTitle: string;
  problemAuthor: string;
  problemMemL: string;
  problemCPUL: string;
  problemDescObject: problemDesc;
  problemIODesc: string;
  problemSamples: Object;
};

export function Editor(props: propsType) {
  return (
    <div className="problem-container">
      <div className="cmp problem-body">
        <div className="problem-header">
          <h2>{props.problemTitle}</h2>
          <p>By {props.problemAuthor}</p>
          <span>
            Limits: {props.problemCPUL}s, {props.problemMemL}m
          </span>
        </div>
        <div className="problem-desc">
          {props.problemDescObject.blocks.map((block: any) => {
            const type = block.type;
            if (type === "paragraph") {
              const text = block.data.text;
              return (
                <div
                  className="problem-desc-paragraph"
                  dangerouslySetInnerHTML={{
                    __html: sanitizer().sanitize(text),
                  }}
                ></div>
              );
            } else if (type === "header") {
              const level = block.data.level; // if header :^)
              const text = block.data.text;
              return React.createElement(`h${level}`, { children: text });
            } else if (type === "embed") {
              const embed = block.data.embed;
              const caption = block.data.caption;

              return (
                <div className="problem-desc-embed-container">
                  <iframe
                    className="problem-desc-embed"
                    width="500px"
                    height="400px"
                    src={embed}
                    frameBorder="0"
                  ></iframe>
                  <span
                    className="caption"
                    dangerouslySetInnerHTML={{
                      __html: sanitizer().sanitize(caption),
                    }}
                  ></span>
                </div>
              );
            } else if (type === "image") {
              let url = block.data.file.url;
              let caption = block.caption;
              return (
                <div className="problem-desc-image">
                  <img src={url} alt={caption} />
                  <span className="caption">{caption}</span>
                </div>
              );
            } else if (type === "linkTool") {
              let link = block.data.link;
              let title = block.data.meta.title;
              let description = block.data.meta.description;
              let image = block.data.meta.image.url;

              return (
                <a className="problem-desc-link-preview" href={link}>
                  <div className="left">
                    <img src={image} alt={title} />
                  </div>
                  <div className="right">
                    <h4>{title}</h4>
                    <span>{description}</span>
                  </div>
                </a>
              );
            }
          })}
        </div>
        <div className="problem-io-desc">{props.problemIODesc}</div>
        <div className="problem-samples">
          <div className="problem-sample-io">
            <div className="problem-sample-input"></div>
            <div className="problem-sample-output"></div>
          </div>
        </div>
      </div>
      <MonacoEditor
        className="code-editor"
        theme="vs-dark"
        defaultLanguage="typescript"
        height="100%"
        width="100%"
        options={{
          fontFamily: "Fira Code",
          moduleResolution: "node",
          fontLigatures: "true",
        }}
      />
    </div>
  );
}
