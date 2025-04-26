import React from 'react';
import ContentLoader from 'react-content-loader';

const FilterLoader = () => (
  <ContentLoader
    speed={2}
    width={200}
    height={20 * 30}
    viewBox='0 0 200 600'
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
  >
    {Array.from({ length: 20 }, (_, idx) => (
      <React.Fragment key={idx}>
        <circle cx='10' cy={'' + (20 + 30 * idx)} r='8' />
        <rect x='25' y={'' + (15 + 30 * idx)} rx='5' ry='5' width='220' height='10' />
      </React.Fragment>
    ))}
  </ContentLoader>
);

export default React.memo(FilterLoader);
