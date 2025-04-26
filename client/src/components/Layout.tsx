import React from 'react';
import { Outlet } from 'react-router-dom';

import TabNav from './TabNav';

function Layout() {
  return (
    <div className='p-4 max-w-5xl mx-auto  bg-gray-50'>
      <TabNav />
      <Outlet />
    </div>
  );
}

export default React.memo(Layout);
