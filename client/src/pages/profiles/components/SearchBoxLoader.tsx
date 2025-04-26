import React from 'react';
import ContentLoader from 'react-content-loader';

const SearchBoxLoader = () => (
  <ContentLoader
    speed={2}
    width='100%'
    height='100%'
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
  >
    <rect x='48' y='8' rx='3' ry='3' width='95%' height='40' />
  </ContentLoader>
);

export default React.memo(SearchBoxLoader);
