import React, { useEffect } from 'react';

const Plan = () => {
  useEffect(() => {
    // Dynamically load the Stripe script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup script when the component unmounts
    };
  }, []);

  return (
    <div style={{ padding: '16px', textAlign: 'center' }}>
      <h2>Select Your Plan</h2>
      <stripe-pricing-table pricing-table-id="prctbl_1Ql7D1HUHzoZhIZk3ydRWrjW"
        publishable-key="pk_test_51QF12KHUHzoZhIZkavd3Ac6QbcYgLgJoBOYPK482H2qkrekY4yNSNuswMJONIt48X0xZjB0yoXxEmFsHLq4leBKC00YO0p3302">
      </stripe-pricing-table>
    </div>
  );
};

export default Plan;
