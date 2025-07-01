import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import routes from '../constants/Routes';

const useTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    // Update title based on the route
    if (location.pathname === routes.homepage) {
      document.title = "Orion";
    } else if (location.pathname === routes.products) {
      document.title = "Orion | Products";
    } else if (location.pathname === routes.termsAndConditions) {
      document.title = "Orion | Terms and Conditions";
    } else if (location.pathname === routes.signup) {
      document.title = "Orion | Sign Up";
    } else if (location.pathname === routes.privacyPolicy) {
      document.title = "Orion | Privacy Policy";
    } else if (location.pathname === routes.riskDisclosure) {
      document.title = "Orion | Risk Disclosure";
    } else {
      document.title = "Orion"; // Default title
    }
  }, [location]);
};

export default useTitleUpdater;
