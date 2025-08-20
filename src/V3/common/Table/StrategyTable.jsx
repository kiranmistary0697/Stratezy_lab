import TableRow from "./TableRow";

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
