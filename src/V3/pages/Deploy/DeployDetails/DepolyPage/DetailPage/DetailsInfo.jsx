import React from "react";

const DetailsInfo = ({ label, value, action }) => {
  return (
    <div className="flex gap-20 items-center w-full max-md:gap-10 max-sm:flex-col max-sm:gap-2 max-sm:items-start">
      <div className="text-sm font-medium leading-4 text-neutral-950 w-[250px] max-sm:w-full">
        {label}
      </div>
      <div className="text-sm leading-5 text-stone-500 max-sm:w-full">
        {value}
      </div>
      {action && (
        <div className="text-sm font-medium text-blue-600 max-sm:w-full">
          {action}
        </div>
      )}
    </div>
  );
};

export default DetailsInfo;
