import React from "react";
import DetailsInfo from "./DetailsInfo";

const DetailsSecation = ({ rows, addSpacing }) => {
  return (
    <>
      {rows.map((row, index) => (
        <DetailsInfo
          key={`${row.label}-${index}`}
          label={row.label}
          value={row.value}
          action={row.action}
        />
      ))}
      {addSpacing && <div className="h-5" />}
    </>
  );
};

export default DetailsSecation;
