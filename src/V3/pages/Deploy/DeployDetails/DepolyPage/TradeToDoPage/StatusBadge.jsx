import React from "react";
import PropTypes from "prop-types";

const StatusBadge = ({ status }) => {
  return (
    <span
      role="status"
      className="gap-1 px-4 py-1 h-7 text-sm font-medium leading-6 text-yellow-600 bg-orange-50 rounded"
    >
      {status}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusBadge;
