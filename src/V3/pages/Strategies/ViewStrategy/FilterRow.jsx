import { Button } from "@mui/material";

import Badge from "./Badge.jsx";
import { DropdownIcon } from "./Icons.jsx";

const FilterRow = ({ filter, operator, onViewClick }) => {
  return (
    <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-2.5">
      {operator && (
        <div className="px-3.5 py-2 text-sm rounded-sm border border-solid border-zinc-200 text-neutral-950 w-[76px]">
          {operator}
        </div>
      )}
      <div className="flex gap-2.5 items-center px-5 py-4 rounded-sm border border-solid bg-stone-50 border-zinc-200">
        <span className="text-sm text-neutral-950">{filter.name}</span>
        <Badge>{filter.type}</Badge>
        <DropdownIcon />
      </div>
      <Button
        className="text-sm !normal-case text-blue-600 cursor-pointer max-sm:self-end"
        onClick={onViewClick}
      >
        {filter.type === "Static" ? "View Stocks" : "View Arguments"}
      </Button>
    </div>
  );
};

export default FilterRow;
