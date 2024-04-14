import logo from "@/assets/Logo.svg";
import Button from "@/components/Button";
import { MdMenuOpen } from "react-icons/md";
import { bundledLanguages, getHighlighter } from "shiki/bundle/web";
import { useState, useEffect, useRef, MouseEvent } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL + "/api/v1";

const expirationTime: { [key: string]: number } = {
  "10_minutes": 10 * 60 * 1000,
  "1_hour": 60 * 60 * 1000,
  "1_day": 24 * 60 * 60 * 1000,
  never: 0,
};

type Paste = {
  key: string;
  content: string;
  settings: {
    language: string;
    editable: string;
    expireAt: string;
  };
};

const toastOptions = {
  style: {
    background: "black",
    color: "white",
  },
};

export default function App() {
  const [codeHtml, setCodeHtml] = useState("");
  const [settingsPanel, setSettingsPanel] = useState("-right-full");
  const languageRef = useRef<HTMLSelectElement>(null);
  const expirationRef = useRef<HTMLSelectElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isPasteRoute = window.location.pathname !== "/";

  useEffect(() => {
    if (!isPasteRoute) return;

    const highlightCode = async () => {
      try {
        console.log(`${BASE_URL}/get/${window.location.pathname.slice(1)}`);

        const res = await axios.get(
          `${BASE_URL}/get/${window.location.pathname.slice(1)}`
        );

        const data: Paste = res.data;
        const highlighter = await getHighlighter({
          themes: ["aurora-x"],
          langs: [...Object.keys(bundledLanguages)],
        });
        const html = highlighter.codeToHtml(data.content, {
          lang: data.settings.language,
          theme: "aurora-x",
        });
        setCodeHtml(html);
      } catch (error) {
        toast.error("Failed to load the paste", toastOptions);
      }
    };
    highlightCode();
  }, [isPasteRoute]);

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!isPasteRoute) {
      if (!textAreaRef.current?.value.trim()) {
        toast.error("Please enter some code", toastOptions);
        return;
      }

      e.currentTarget.disabled = true;

      const toastId = toast.loading("Generating...", toastOptions);

      try {
        const res = await axios.post(`${BASE_URL}/paste`, {
          content: textAreaRef.current?.value,
          settings: {
            language: languageRef.current?.value,
            expireAt: expirationTime[expirationRef.current?.value || "never"],
          },
        });

        if (res.status === 201) {
          const { key } = res.data as Paste;
          toast.dismiss(toastId);
          window.location.href = `/${key}`;
        } else {
          toast.error("Something went wrong", {
            id: toastId,
            ...toastOptions,
          });
        }
      } catch (error) {
        toast.error((error as Error).message || "An unknown error occurred", {
          id: toastId,
          ...toastOptions,
        });
      }

      e.currentTarget.disabled = false;
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="bg-[#1B1B1C] w-full min-h-screen relative overflow-hidden">
      <nav className="bg-[#07090F] flex items-center justify-between px-3 sm:px-16 h-[12vh] border-b-2 border-b-white">
        <img src={logo} className="w-32 sm:w-40" alt="Logo" />
        <div className="flex items-center gap-3">
          <Button onClick={handleClick}>
            {isPasteRoute ? "Create" : "Save"}
          </Button>
          <span
            className={`text-3xl cursor-pointer relative z-20 ${
              isPasteRoute ? "hidden" : "block"
            }`}
            onClick={() =>
              setSettingsPanel((prev) =>
                prev === "-right-full" ? "right-0" : "-right-full"
              )
            }
          >
            <MdMenuOpen />
          </span>
        </div>
      </nav>
      <div className="bg-[#07090F] w-full min-h-[88vh] px-3 sm:px-16 overflow-auto mt-1">
        {isPasteRoute ? (
          <code
            className=" outline-none  overflow-x-scroll  w-full h-full"
            dangerouslySetInnerHTML={{ __html: codeHtml }}
          ></code>
        ) : (
          <textarea
            className="outline-none  overflow-x-scroll  w-full min-h-[85vh] p-2 bg-inherit border-[1px] mt-1 resize-none"
            placeholder="Paste Your Code Here"
            ref={textAreaRef}
          ></textarea>
        )}
      </div>

      <div
        className={`absolute top-0 ${settingsPanel} w-full sm:w-2/4 md:w-2/5 lg:w-1/4 h-full flex items-start justify-center  bg-[#07090F] border-l-2 border-l-white transition-all duration-500`}
      >
        <div className="mt-[5.35rem] border-t-2 border-t-white  w-full flex flex-col items-center justify-center gap-2">
          <select
            name="language"
            id="language"
            className=" bg-[#07090F] border-2 rounded-sm p-1  outline-none w-3/4 mt-8"
            defaultValue={"javascript"}
            ref={languageRef}
          >
            {Object.keys(bundledLanguages).map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <select
            name="expiration"
            id="expiration"
            className=" bg-[#07090F] border-2 rounded-sm p-1  outline-none w-3/4  "
            defaultValue={"never"}
            ref={expirationRef}
          >
            {Object.keys(expirationTime).map((time) => (
              <option key={time} value={time}>
                {time.toUpperCase().replace(/_/g, " ")}
              </option>
            ))}
          </select>

          <div className="w-3/4 ">
            <Button
              className="w-full flex items-center justify-center"
              onClick={handleClick}
            >
              <span>Save</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
