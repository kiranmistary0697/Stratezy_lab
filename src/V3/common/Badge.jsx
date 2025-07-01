"use client";

const Badge = ({
  children,
  variant = "default",
  isSquare,
  isStrategyTooltip = false,
}) => {
  const getVariantClasses = (variant) => {
    //#CC8325
    switch (variant) {
      case "version":
        return "bg-indigo-50 text-indigo-700 border-[#C7D7FE]";
      case "draft":
        return "bg-[#FFF5E7] text-[#EDA84E] border !border-[#EDA84E]";
      case "activating":
        return "bg-[#FFF5E7] text-[#EDA84E] border !border-[#EDA84E]";
      case "planned":
        return "bg-[#FFF5E7] text-[#EDA84E] border !border-[#EDA84E]";
      case "completed":
        return "bg-emerald-50 text-green-500 border-green-500";
      case "complete":
        return "bg-emerald-50 text-green-500 border-green-500";
      case "active":
        return "bg-emerald-50 text-green-500 border-green-500";
      case "demo":
        return "bg-neutral-50 text-neutral-400 border-neutral-400";
      case "disable":
        return "text-[#A4A4A4] bg-[#FAFAFA] border- 1px solid [#A4A4A4]";
      case "in progress":
        return "bg-[#FFFAF0] text-[#CC8325] ";
      case "in_progress":
        return "bg-[#FFF5E7] text-[#EDA84E] border !border-[#EDA84E]";
      case "failed":
        return "bg-[#FFEAE4] text-[#F25324]";
      case "operational":
        return "bg-emerald-50 text-green-500 border-green-500";
      default:
        return "bg-gray-100 text-gray-600 border-gray-400"; // Fallback variant
    }
  };

  return isSquare ? (
    <span
      className={`p-4 py-1 text-xs text-center whitespace-nowrap rounded-sm ${getVariantClasses(
        variant
      )}`}
    >
      {children}
    </span>
  ) : (
    <span
      className={`px-2 py-0.5 ${
        isStrategyTooltip ? "text-[10px]" : "text-xs"
      } text-center whitespace-nowrap rounded-2xl border border-solid  ${getVariantClasses(
        variant
      )}`}
    >
      {children}
    </span>
  );
};

export default Badge;
