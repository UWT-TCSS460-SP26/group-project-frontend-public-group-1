import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  as?: "input";
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  as: "select";
};

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  as: "textarea";
};

type Props = InputProps | SelectProps | TextareaProps;

export const Input = ({ as = "input", className = "", ...props }: Props) => {
  const baseStyles =
    "w-full bg-surface border border-border text-text-primary rounded-xl px-4 py-3 outline-hidden focus:border-brand-blue transition-colors placeholder:text-text-muted";

  if (as === "select") {
    return (
      <select
        className={`${baseStyles} ${className}`}
        {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
      />
    );
  }

  if (as === "textarea") {
    return (
      <textarea
        className={`${baseStyles} ${className}`}
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    );
  }

  return (
    <input
      className={`${baseStyles} ${className}`}
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  );
};