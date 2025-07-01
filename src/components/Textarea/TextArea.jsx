import React from "react";
import { Color } from "../../constants/AppResource";

const TextArea = ({
  value,
  onChange,
  minHeight = "150px",
  placeholder = "enter",
  borderStyle = "border-dotted",
  style = {},
  name = "",
}) => {
  return (
    <div
      className={`border-2 ${borderStyle} rounded-lg overflow-hidden mt-3 border-lightDark`}
      style={{ ...style }}
    >
      <textarea
        placeholder={placeholder}
        className="w-[100%] p-3 text-sm bg-fadeGray border-none outline-none"
        style={{
          minHeight,
        }}
        value={value || ""}
        onChange={onChange}
        name={name}
      ></textarea>
    </div>
  );
};

export default TextArea;
