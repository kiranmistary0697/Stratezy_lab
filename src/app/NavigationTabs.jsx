import { useNavigate, useLocation } from "react-router-dom";

const NavigationTab = ({ children, gradient, to }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // const isActive = location.pathname === to; // Dynamically check active state
  const isActive = location.pathname.startsWith(to);

  const handleClick = () => {
    const hasUnsavedChanges = localStorage.getItem("newchange") === "true";
    if (hasUnsavedChanges) {
      // Just set flag, let destination component handle modal
      localStorage.setItem("navigateToCreate", "true");
      return; // ❌ Do NOT navigate
    }
    navigate(to); // ✅ Only navigate if no unsaved changes
  };

  // const handleClick = () => {
  //   if (to) {
  //     navigate(to);
  //   }
  // };

  const baseClasses =
    "gap-2.5 self-stretch px-2.5 py-2 my-auto rounded min-h-[30px] cursor-pointer";

  if (gradient) {
    return (
      <div
        className={`flex ${baseClasses}   ${
          isActive ? "bg-slate-100" : "bg-white"
        }`}
        onClick={() => {
          navigate(`/Devstudio/create-function`);
        }}
      >
        <span
          style={{
            background: "linear-gradient(90deg, #0037FF 0%, #FF1DC6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {children}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${
        isActive || (children === "Strategies" && location.pathname === "/app")
          ? "bg-slate-100 text-blue-600"
          : "bg-white text-neutral-950"
      }`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default NavigationTab;
