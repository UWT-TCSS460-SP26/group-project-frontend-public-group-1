import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card = ({ children, className = "", hoverable = true }: CardProps) => {
  return (
    <div
      className={`
        bg-surface border border-border rounded-2xl p-4 transition-all duration-200
        ${hoverable ? "hover:border-text-muted hover:shadow-xl" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
