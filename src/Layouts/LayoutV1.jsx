import React from 'react';
import Navbar from '../pages/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

const LayoutV1 = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default LayoutV1;