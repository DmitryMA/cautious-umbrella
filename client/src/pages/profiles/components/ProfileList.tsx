import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import { useRef } from 'react';

import { Hobbies, Profiles } from '../../../../api/types';

import { ProfileCard } from './ProfileCard';

type Props = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  profiles: Profiles;
  hobbies: Hobbies;
  fetchNextPage: () => void;
};

function ProfileList({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  profiles,
  hobbies: allHobbies,
}: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: profiles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 116 + 10, //
    overscan: 5,
  });

  const handleScroll = () => {
    const el = parentRef.current;
    if (!el) return;
    // when scrolled within 100px from bottom
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 100) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };
  return (
    <div ref={parentRef} style={{ height: '680px', overflowY: 'auto' }} onScroll={handleScroll}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow: VirtualItem) => {
          const idx = virtualRow.index;
          const profile = profiles[idx];

          const relevantHobbies = allHobbies
            .filter(h => profile.hobbies.includes(h.id))
            .map(h => h.name);

          return (
            <div
              key={profile.id}
              className='py-1'
              ref={rowVirtualizer.measureElement}
              style={{
                position: 'absolute',
                top: `${virtualRow.start}px`,
                width: '100%',
              }}
            >
              <ProfileCard
                tabIdx={idx + 2}
                key={profile.id}
                avatar={profile.avatar}
                first_name={profile.first_name}
                last_name={profile.last_name}
                age={profile.age}
                country={profile.country}
                nationality={profile.nationality}
                hobbies={relevantHobbies}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProfileList;
