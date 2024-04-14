import { VariantProps, cva } from "class-variance-authority";
import { HtmlHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(["flex items-center gap-2 "], {
  variants: {
    variant: {
      default: [
        "bg-gradient-to-r from-[#849AFF] to-[#5671E6] px-3 py-1 rounded-sm ",
      ],
      icon: [
        "border-2 border-[#849AFF]  rounded-full p-1 hover:border-[#5671E6] hover:rotate-45 transition-all duration-300 ",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type ButtonProps = HtmlHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isDisabled?: boolean;
  };

export default function Button({
  children,
  className,
  variant,
  isDisabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={isDisabled}
      className={twMerge(buttonVariants({ variant }), className)}
    >
      {children}
    </button>
  );
}
