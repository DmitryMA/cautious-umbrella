import React from 'react';
import ContentLoader from 'react-content-loader';

const StreamReaderLoader = () => (
  <ContentLoader
    speed={2}
    width='100%'
    height={160}
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
    className='w-full h-[300px]'
  >
    <rect x='0' y='0' rx='3' ry='3' width='100%' height='20' />
    <rect x='0' y='30' rx='3' ry='3' width='100%' height='20' />
    <rect x='0' y='60' rx='3' ry='3' width='100%' height='20' />
    <rect x='0' y='90' rx='3' ry='3' width='100%' height='20' />
    <rect x='0' y='120' rx='3' ry='3' width='100%' height='20' />
    <rect x='0' y='150' rx='3' ry='3' width='100%' height='20' />
    <rect x='0' y='180' rx='3' ry='3' width='100%' height='20' />
    <rect x='0' y='210' rx='3' ry='3' width='100%' height='20' />
    <rect x='0' y='240' rx='3' ry='3' width='100%' height='20' />
  </ContentLoader>
);

export default React.memo(StreamReaderLoader);
