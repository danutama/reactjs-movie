import React, { useState, useEffect } from 'react';
import Card from './Card';

const Skeleton = () => {
  const [count, setCount] = useState(6);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 500) {
        setCount(3);
      } else {
        setCount(6);
      }
    };

    updateCount();

    window.addEventListener('resize', updateCount);

    return () => window.removeEventListener('resize', updateCount);
  }, []);

  return (
    <div className="overflow-auto scrollbar-custom">
      <div className="d-flex gap-2 justify-content-start">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="col-sm-custom col-lg-2 col-md-4 col-6 mb-2">
            <Card>
              <img src="/default-poster.webp" alt="loading" />
              <div className="card-body pb-4">
                <div className="skeleton mb-3"></div>
                <div className="skeleton"></div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
