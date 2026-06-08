import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  as?: "input" | "select" | "textarea";
}

export const Input = ({
  as = "input",
  className = "",
  ...props
}: InputProps) => {
  const baseStyles =
    "w-full bg-surface border border-border text-text-primary rounded-xl px-4 py-3 outline-hidden focus:border-brand-blue transition-colors placeholder:text-text-muted";

  const Element = as as any;

  return (
    <Element
      className={`${baseStyles} ${className}`}
      {...props}
    />
  );
};
