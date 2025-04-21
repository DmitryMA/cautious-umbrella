import { FC } from 'react';

import { Profile } from '../../../../api/types';

export const ProfileCard: FC<
  Omit<Profile, 'id' | 'hobbies' | 'created_time'> & { tabIdx: number; hobbies: string[] }
> = ({ avatar, first_name, last_name, country, nationality, age, hobbies, tabIdx }) => {
  const visible = hobbies.slice(0, 2).join(', ');
  const extra = hobbies.length > 2 ? `+${hobbies.length - 2}` : '';
  const tooltipContent = hobbies.slice(2).join(', ');

  return (
    <div
      className='w-full min-h-[116px] bg-white shadow rounded-lg p-4 flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6'
      tabIndex={tabIdx}
    >
      <img
        src={avatar}
        alt={`${first_name} avatar`}
        className='flex-shrink-0 h-16 w-16 rounded-full object-cover'
      />
      <div className='flex-1 flex flex-col justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          {first_name} {last_name}
        </h3>

        <div className='flex justify-between text-gray-600 mt-1'>
          <span>
            {country} [{nationality}]
          </span>
          <span>{age} years</span>
        </div>

        <div className='mt-2 text-sm text-gray-700'>
          <span>{visible}</span>
          <div className='relative inline-block group'>
            {extra && (
              <>
                <span className='font-medium ml-1 cursor-help'>{extra}</span>
                <div className='absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10'>
                  {tooltipContent}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
