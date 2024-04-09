import { useState, useEffect , useRef } from "react";
import logo from "./assets/Logo.svg";
import Button from "./components/Button";
import { FaGithub } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { bundledLanguages, getHighlighter } from "shiki/bundle/web";


// todo add save keybord listner (check os)

const value = `import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ValidationError, fromZodError } from "zod-validation-error";

const validateResource =
  (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({
          body: req.body,
          params: req.params,
        });
        next();
      } catch (e: any ) {
        let errorRes: { error: typeof e, errorMessage?: string | ValidationError } = { error: JSON.stringify(e) }
        if (e instanceof ZodError) {
          errorRes.errorMessage = fromZodError(e)
        } else {
          errorRes.errorMessage = 'Invalid request'
        }
        return res.status(400).json(errorRes);
      }
    };

export default validateResource;
`;

export default function App() {
  const [codeHtml, setCodeHtml] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
          Star Me <FaGithub />
        </Button>
      </nav>
      <div className="flex flex-col items-center justify-center gap-3">
        {/* <textarea className="w-full sm:max-w-[90%] lg:max-w-[60%] text-sm p-2 border-2 border-white/30  h-[70vh] bg-[#24292E] aspect-video rounded-sm overflow-scroll outline-none resize-none" ref={textAreaRef}></textarea> */}
        <code className="w-full sm:max-w-[90%] lg:max-w-[60%] text-sm p-2 border-2 border-white/30  h-[70vh] bg-[#24292E] aspect-video rounded-sm overflow-scroll outline-none resize-none" dangerouslySetInnerHTML={{ __html: codeHtml }}></code>

        <div className="flex items-center justify-center gap-3 my-3">
          <Button
            className="text-lg"
            onClick={() => {
              const url = new URL(window.location.href);
              url.pathname = "/hi";
              window.location.href = url.href;
            }}
          >
            Generate
          </Button>
          <Button className="text-lg py-2">
            <IoMdSettings />
          </Button>
        </div>
      </div>
    </div>
  );
}
