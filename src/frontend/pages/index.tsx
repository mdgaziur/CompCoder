import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Editor } from "../components/EditorView";

export default function Test() {
  let [isBreadCrumbActive, setBreadCrumbStatus] = useState(false);
  return (
    <div>
      <div className="cmp">
        <div className="header">
          <div className="header-main-content">
            <div
              className={`breadcrumb ${isBreadCrumbActive ? "active" : ""}`}
              onClick={() => setBreadCrumbStatus(!isBreadCrumbActive)}
            >
              <div></div>
              <div></div>
              <div></div>
            </div>
            <h4>Header</h4>
          </div>
          <div className="header-secondary">
            <div
              className={`header-contents ${
                isBreadCrumbActive ? "active" : ""
              }`}
            >
              <div className="header-buttons">
                <button className="header-button">Button 1</button>
                <button className="header-button">Button 2</button>
                <button className="header-button">Button 3</button>
                <button className="header-button">Button 4</button>
              </div>
              <div className="header-searchbar">
                <input type="text" placeholder="Search anything..." />
                <button>
                  <IoSearch id="header-search-icon" />
                </button>
              </div>
            </div>
            <div className="header-account-dropdown">
              <img src="https://picsum.photos/50/50" alt="Profile Image" />
              <ul>
                <li>
                  <a href="#">Login</a>
                </li>
                <li>
                  <a href="#">Register</a>
                </li>
                <li>
                  <a href="#">Dashboard</a>
                </li>
                <li>
                  <a href="#">Submissions</a>
                </li>
                <li>
                  <a href="#">Drafts</a>
                </li>
                <li>
                  <a href="#">Problems</a>
                </li>
                <li>
                  <a href="#">Settings</a>
                </li>
                <li>
                  <a href="#">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
        <br />
        <br />
        <h1>Buttons</h1>
        <div>
          <button className="primary">Primary</button>
          <button className="positive">Positive</button>
          <button className="negative">Negative</button>
          <button className="disabled">Disabled</button>
          <button className="header-button">Header Button</button>
        </div>
      </div>
      <Editor
        problemTitle="Test"
        problemAuthor="lorem"
        problemCPUL="1"
        problemMemL="100"
        problemDescObject={{
          time: 1554920381017,
          blocks: [
            {
              type: "header",
              data: {
                text: "Welcome!",
                level: 1,
              },
            },
            {
              type: "paragraph",
              data: {
                text:
                  "The following are the examples what you can do with this editor",
              },
            },
            {
              type: "paragraph",
              data: {
                text:
                  "<a href='https://google.com'>This is a link which points to Google.com",
              },
            },
            {
              type: "embed",
              data: {
                service: "coub",
                source: "https://coub.com/view/1czcdf",
                embed: "https://coub.com/embed/1czcdf",
                caption:
                  "This an embedded video which has a cute cat in it ;) You can just paste the video link and it'll be automatically embedded ;)",
              },
            },
            {
              type: "header",
              data: {
                text: "This is a level 1 header",
                level: 1,
              },
            },
            {
              type: "header",
              data: {
                text: "This is a level 2 header",
                level: 2,
              },
            },
            {
              type: "header",
              data: {
                text: "This is a level 3 header",
                level: 3,
              },
            },
            {
              type: "header",
              data: {
                text: "This is a level 4 header",
                level: 4,
              },
            },
            {
              type: "header",
              data: {
                text: "This is a level 5 header",
                level: 5,
              },
            },
            {
              type: "header",
              data: {
                text: "This is a level 6 header",
                level: 6,
              },
            },
            {
              type: "paragraph",
              data: {
                text: "This is a paragraph",
              },
            },
            {
              type: "image",
              data: {
                file: {
                  url:
                    "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg",
                },
                caption:
                  "This is an image. You can add images using urls or by uploading directly to our server. And Also, the text in this box will be the caption for this image",
                withBorder: false,
                withBackground: false,
              },
            },
            {
              type: "paragraph",
              data: {
                text:
                  "You can add link with preview by using linktool like below:",
              },
            },
            {
              type: "linkTool",
              data: {
                link: "https://codex.so",
                meta: {
                  title: "CodeX Team",
                  site_name: "CodeX",
                  description:
                    "Club of web-development, design and marketing. We build team learning how to build full-valued projects on the world market.",
                  image: {
                    url: "https://codex.so/public/app/img/meta_img.png",
                  },
                },
              },
            },
            {
              type: "paragraph",
              data: {
                text: "You can also add quotes like below:",
              },
            },
            {
              type: "quote",
              data: {
                text: "The unexamined life is not worth living.",
                caption: "Socrates",
                alignment: "left",
              },
            },
          ],
          version: "2.12.4",
        }}
        problemIODesc="IO description"
        problemSamples="NULL"
      />
    </div>
  );
}
