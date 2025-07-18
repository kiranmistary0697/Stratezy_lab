"use client";

import TableRow from "./TableRow";

// const TableHeader = ({ label, hasFilter }) => (
//   <th className="flex grow shrink gap-3 items-center self-stretch px-6 py-4 my-auto whitespace-nowrap bg-white border-b border-gray-200 min-h-11 text-xs font-semibold text-stone-500">
//     <div className="flex flex-1 shrink gap-10 justify-between items-center self-stretch my-auto w-full basis-0">
//       <span>{label}</span>
//       {hasFilter && (
//         <div className="flex shrink-0 self-stretch my-auto h-[15px] w-[15px]" />
//       )}
//     </div>
//   </th>
// );

const StrategyTable = ({ strategies }) => {
  return (
    <section className="mt-8 max-w-full rounded-sm border-t border-r border-l border-gray-200">
      <table className="w-full">
        <thead></thead>
        <tbody>
          <TableRow strategy={strategies} />
        </tbody>
      </table>
    </section>
  );
};

export default StrategyTable;
