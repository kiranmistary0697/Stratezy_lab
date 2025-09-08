import PropTypes from "prop-types";

const TimeDisplay = ({ days }) => {
  return <span className="text-sm text-stone-500">{days} Days</span>;
};

TimeDisplay.propTypes = {
  days: PropTypes.number.isRequired,
};

export default TimeDisplay;
