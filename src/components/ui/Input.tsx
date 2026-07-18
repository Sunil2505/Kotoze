import { InputHTMLAttributes } from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input({
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      className={`h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition-all focus:border-emerald-500 ${className}`}
      {...props}
    />
  );
}