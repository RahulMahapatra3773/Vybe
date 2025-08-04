import React from 'react';

import Feed from './Feed';
import useGetExplorePost from '@/hooks/useGetExplorePost';

const Explore = () => {
  useGetExplorePost();

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 w-full">
        <Feed />
      </div>
    </div>
  );
};

export default Explore;
