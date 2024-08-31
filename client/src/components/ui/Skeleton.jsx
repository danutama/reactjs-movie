import React from 'react';

const Skeleton = () => {
  return (
    <div className="d-flex gap-2 justify-content-start overflow-hidden">
      <div className="col-lg-2 col-md-4 col-6">
        <div className="skeleton box-wrapper rounded-4"></div>
      </div>
      <div className="col-lg-2 col-md-4 col-6">
        <div className="skeleton box-wrapper rounded-4"></div>
      </div>
      <div className="col-lg-2 col-md-4 col-6">
        <div className="skeleton box-wrapper rounded-4"></div>
      </div>
      <div className="col-lg-2 col-md-4 col-6">
        <div className="skeleton box-wrapper rounded-4"></div>
      </div>
      <div className="col-lg-2 col-md-4 col-6">
        <div className="skeleton box-wrapper rounded-4"></div>
      </div>
      <div className="col-lg-2 col-md-4 col-6">
        <div className="skeleton box-wrapper rounded-4"></div>
      </div>
    </div>
  );
};

export default Skeleton;
