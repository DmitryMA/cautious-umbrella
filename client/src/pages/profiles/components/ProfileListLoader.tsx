import React from 'react';
import ContentLoader from 'react-content-loader';

const ProfileListLoader = () => (
  <ContentLoader
    speed={2}
    width={476}
    height={6 * 100}
    viewBox={`0 0 476 ${124 * 6}`}
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
  >
    {Array.from({ length: 6 }, (_, idx) => (
      <React.Fragment key={idx}>
        <rect x='48' y={8 + 124 * idx} rx='3' ry='3' width='88' height='6' />
        <rect x='48' y={26 + 124 * idx} rx='3' ry='3' width='52' height='6' />
        <rect x='0' y={56 + 124 * idx} rx='3' ry='3' width='410' height='6' />
        <rect x='0' y={72 + 124 * idx} rx='3' ry='3' width='380' height='6' />
        <rect x='0' y={88 + 124 * idx} rx='3' ry='3' width='178' height='6' />
        <circle cx='20' cy={20 + 124 * idx} r='20' />
      </React.Fragment>
    ))}
  </ContentLoader>
);

export default ProfileListLoader;
