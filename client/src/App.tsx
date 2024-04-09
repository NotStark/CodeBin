import { useState, useEffect } from "react";
import logo from "./assets/Logo.svg";
import Button from "./components/Button";
import { FaGithub } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { bundledLanguages, getHighlighter } from "shiki/bundle/web";


const value = `import { Response, Request } from "express"
`;

export default function App() {
  const [codeHtml, setCodeHtml] = useState("");

  useEffect(() => {
    async function highlightCode() {
      const highlighter = await getHighlighter({
        themes: ["github-light", "github-dark"],
        langs: [...Object.keys(bundledLanguages)],
      });

      const html = highlighter.codeToHtml(value, {
        lang: "javascript",
        theme: "github-dark",
      });
      setCodeHtml(html);
    }
    highlightCode();
  }, []);

  return (
    <div className="bg-[#1B1B1C] w-full min-h-screen">
      <nav className="flex items-center justify-between px-3 sm:px-16 py-8">
        <img src={logo} className="w-32 sm:w-40" alt="Logo" />
        <Button
          onClick={() => {
            window.open("https://github.com/NotStark/CodeBin", "_blank");
          }}
        >
          Stark Me <FaGithub />
        </Button>
      </nav>
      <div className="flex flex-col items-center justify-center gap-3">
        <div
          className="w-full sm:max-w-[90%] lg:max-w-[60%] text-sm p-2 border-2 border-white/30  h-[70vh] bg-[#24292E] aspect-video rounded-sm overflow-scroll"
          dangerouslySetInnerHTML={{ __html: codeHtml }}
        ></div>

        <div className="flex items-center justify-center gap-3 my-3">
          <Button className="text-lg">Generate</Button>
          <Button className="text-lg py-2">
            <IoMdSettings />
          </Button>
        </div>
      </div>
    </div>
  );
}
