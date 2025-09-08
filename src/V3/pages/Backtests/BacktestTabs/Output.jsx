import { useMemo } from "react";
import useDateTime from "../../../hooks/useDateTime";
import useTimeFormat from "../../../hooks/useTimeFormat";

function normalizeSummary(summary) {
  if (!summary || typeof summary !== "object") return {};
  const out = {};
  for (const [rawK, v] of Object.entries(summary)) {
    const k = String(rawK)
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/["“”]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    out[k] = v;
  }
  return out;
}

function parseKRsToNumber(val) {
  if (val == null) return null;
  const s = String(val).trim();

  const num = parseFloat(s.replace(/[,₹]/g, "").match(/-?\d+(\.\d+)?/)?.[0]);
  if (Number.isNaN(num)) return null;

  const hasStandaloneK = /\bK\b/i.test(s) || /\bK\s*Rs\.?/i.test(s);
  return hasStandaloneK ? num * 1000 : num;
}

function formatINR(n) {
  if (n == null || Number.isNaN(n)) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

function Row({ label, value }) {
  return (
    <>
      <span className="font-semibold text-gray-900 whitespace-normal sm:whitespace-nowrap break-words">
        {label}
      </span>
      <span className="text-[#666666] break-words min-w-0">{value ?? "-"}</span>
    </>
  );
}

const Output = ({ summary, data }) => {
  const S = useMemo(() => normalizeSummary(summary), [summary]);

  const formattedDateTime = useDateTime(data?.executionTime);
  const formattedTime = useTimeFormat(S["time taken(ms)"]);

  const money = useMemo(() => {
    const pull = (canon) => formatINR(parseKRsToNumber(S[canon]));
    return {
      startCapital: pull("start capital"),
      netProfit: pull("net profit"),
      currentAccountValue: pull("current account value"),
      maxAccountValue: pull("max account val"),
      investedPrincipal: pull("invested principal"),
      minAccountVal: pull("min account val"),
      uninvestedCapital: pull("uninvested capital"),
      netBookedProfit: pull("net booked profit"),
    };
  }, [S]);

  const perf = {
    avgProfitPerTrade: S["avg profit/trade"] ?? "-",
    avgAnnualProfit: S["avg annual profit"] ?? "-",
    avgAccuracy: S["avg accuracy"] ?? "-",
    maxDrawdown: S["max drawdown"] ?? "-",
  };

  const rest = {
    Expectancy: S["expectancy"] ?? "-",
    "Sharpe ratio":
      (data?.sharpeRatio != null && !Number.isNaN(Number(data?.sharpeRatio))
        ? Number(data.sharpeRatio).toFixed(2)
        : S["sharpe ratio"]) ?? "-",
    "Stddev of R": S["stddev of r"] ?? "-",
    SQN: S["sqn"] ?? "-",
    "Average Duration/trade": S["average duration/trade"] ?? "-",
    "Max number of Open Trades": S["max number of open trades"] ?? "-",
    "Total number of trades": S["total number of trades"] ?? "-",
  };

  return (
    <div className="space-y-4 p-3 sm:p-4 overflow-auto">
      {/* Money Card */}
      <div className="rounded-2xl border bg-white p-3 sm:p-4 shadow-sm">
        <h3 className="text-base font-semibold mb-3 text-blue-600">
          Account & P/L
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-x-3 gap-y-1 sm:gap-y-2 text-sm text-gray-900">
          <Row label="Start Capital" value={money.startCapital} />
          <Row label="Net Profit" value={money.netProfit} />
          <Row
            label="Current Account Value"
            value={money.currentAccountValue}
          />
          <Row label="Max Account Value" value={money.maxAccountValue} />
          <Row label="Net booked profit" value={money.netBookedProfit} />
        </div>
      </div>

      {/* Performance Card */}
      <div className="rounded-2xl border bg-white p-3 sm:p-4 shadow-sm">
        <h3 className="text-base font-semibold mb-3 text-blue-600">
          Performance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-x-3 gap-y-1 sm:gap-y-2 text-sm text-gray-900">
          <Row label="Avg profit/trade" value={perf.avgProfitPerTrade} />
          <Row label="Avg annual profit" value={perf.avgAnnualProfit} />
          <Row label="Avg accuracy" value={perf.avgAccuracy} />
          <Row label="Max Drawdown" value={perf.maxDrawdown} />
        </div>
      </div>

      {/* Statistics Card */}
      <div className="rounded-2xl border bg-white p-3 sm:p-4 shadow-sm">
        <h3 className="text-base font-semibold mb-3 text-blue-600">
          Statistics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-x-3 gap-y-1 sm:gap-y-2 text-sm text-gray-900">
          {Object.entries(rest).map(([k, v]) => (
            <Row key={k} label={k} value={v} />
          ))}
        </div>
      </div>

      {/* Execution Card */}
      <div className="rounded-2xl border bg-white p-3 sm:p-4 shadow-sm">
        <h3 className="text-base font-semibold mb-3 text-blue-600">
          Execution
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-x-3 gap-y-1 sm:gap-y-2 text-sm text-gray-900">
          <Row label="Executed On" value={formattedDateTime ?? "-"} />
          <Row label="Execution Time" value={formattedTime ?? "-"} />
        </div>
      </div>
    </div>
  );
};

export default Output;
