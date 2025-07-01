"use client";
import { InfoIcon } from "./Icons";

const StockBundleContent = () => {
  return (
    <main className="flex-1">
      <header className="flex gap-2.5 items-center mb-2.5">
        <h2 className="text-xl font-semibold text-neutral-950">Stock Bundle</h2>

        <InfoIcon />
      </header>

      <p className="mb-8 text-sm text-stone-500">
        Stock bundle is a set of stocks that are either statically chosen or
        dynamically determined based on a stock filter criteria
      </p>

      <div className="px-4 py-2 mb-8 text-base text-amber-700 bg-yellow-50">
        Grouping of multiple stock filters is done from Top to down. If S1, S2,
        S3 are in this order, it will be((S1 AND S2) OR S3)
      </div>

      <section className="flex flex-col gap-5">
        <div className="flex gap-2.5 items-center text-xs font-semibold text-neutral-950">
          <span>Select Stock Filters</span>

          <InfoIcon />
        </div>

        {/* <Box className="max-md:max-w-full">
          <StockBundleStep filter={filters} propFilter={propFilter} />
        </Box> */}
      </section>
    </main>
  );
};

export default StockBundleContent;
