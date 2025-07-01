import React from "react";

const Badge = ({ children, variant = "primary" }) => {
  const variants = {
    primary: "text-indigo-700 bg-indigo-50 border-indigo-200",
  };

  return (
    <span
      className={`px-2 py-0.5 text-xs rounded-2xl border border-solid ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
