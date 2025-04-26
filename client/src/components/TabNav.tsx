import React from 'react';
import { Link } from 'react-router-dom';

function TaskNav() {
  return (
    <nav className='flex gap-4 mb-4'>
      <Link to='/task/1' className='text-blue-500 hover:underline'>
        Task 1
      </Link>
      <Link to='/task/2' className='text-blue-500 hover:underline'>
        Task 2
      </Link>
      <Link to='/task/3' className='text-blue-500 hover:underline'>
        Task 3
      </Link>
    </nav>
  );
}

export default React.memo(TaskNav);
