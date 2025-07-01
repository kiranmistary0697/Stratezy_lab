import React from "react";
import { Box } from "@mui/material";

const PlansCard = ({
  title,
  description,
  price,
  //   isCurrentPlan,
  isRecommended,
  features,
  buttonText,
  buttonClassName,
  handleChangeButtonText = () => {},
}) => {
  return (
    <Box className="flex flex-col gap-4 items-start p-8 rounded-sm !border border-[#EFEFEF]  w-[311px]">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-base font-semibold text-neutral-950">{title}</h2>
        {isRecommended && (
          <div className="px-2 py-0.5 text-xs text-green-500 bg-emerald-50 rounded-2xl border-[#31BF71] border">
            Recommended
          </div>
        )}
      </div>
      <p className="text-sm text-stone-500">{description}</p>
      <div className="flex gap-4 items-end">
        <span className="text-3xl font-semibold text-black">${price}</span>
        <span className="text-sm text-stone-500">{"Billed Monthly"}</span>
      </div>
      <div className="w-full h-px bg-gray-200" />
      <button
        onClick={handleChangeButtonText}
        className={`px-5 py-4 w-full h-10 text-sm rounded-sm ${buttonClassName} flex items-center justify-center`}
      >
        {buttonText}
      </button>
      <div className="w-full h-px bg-gray-200" />
      <ul className="list-disc pl-5 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="text-sm text-neutral-950">
            {feature}
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default PlansCard;
