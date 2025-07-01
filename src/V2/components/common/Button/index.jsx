import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, onClick, variant = 'outlined', className = '', ...rest }) => {
  const buttonClasses =
    variant === 'outlined'
      ? 'bg-primary-white hover:bg-primary-blue-hover text-[#3D69D3] font-semibold hover:text-primary-white py-2 px-4 border border-primary-blue hover:border-primary-blue rounded-[7px] transition-all duration-200'
      : 'bg-primary-blue hover:bg-primary-blue-hover font-semibold text-primary-white py-2 px-4 border border-primary-blue rounded-[7px] transition-all duration-200';

  // Combine the default classes with any custom classes passed through `className`
  const combinedClasses = `${buttonClasses} ${className}`;

  return (
    <button onClick={onClick} className={combinedClasses} {...rest}>
      {children}
    </button>
  );
};

// Optional: PropTypes for type-checking (not required)
Button.propTypes = {
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['outlined', 'filled']),
  className: PropTypes.string,
};

export default Button;
