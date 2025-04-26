import React, { FC } from 'react';

type Props = {
  id: number;
  classNames: string;
  text: string;
};

const StatusCard: FC<Props> = ({ id, classNames, text }) => (
  <div className='bg-white rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200'>
    <div className='flex items-center justify-between'>
      <span className='text-lg font-normal text-gray-700 text-nowrap'>Request #{id}</span>
      <span
        className={`inline-flex text-nowrap items-center px-2 py-1 text-xs font-semibold rounded-full ${classNames || ''}`}
      >
        {text}
      </span>
    </div>
  </div>
);

export default React.memo(StatusCard);
