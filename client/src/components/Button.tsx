import { HtmlHTMLAttributes } from "react";

type ButtonProps = HtmlHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`bg-gradient-to-r from-[#849AFF] to-[#5671E6] flex items-center gap-2 px-3 py-1 rounded-sm tracking-tight font-semibold text-sm ${className && className}`}
    >
      {children}
    </button>
  );
}
