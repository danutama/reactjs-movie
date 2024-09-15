import React from 'react';
import Card from './Card';

const Skeleton = () => {
  return (
    <div className="overflow-auto scrollbar-custom">
      <div className="d-flex gap-2 justify-content-start">
        <div className="col-lg-2 col-md-4 col-6 mb-2">
          <Card>
            <img src="/default-poster.png" alt="loading" />
            <div className="card-body pb-4">
              <div className="skeleton mb-3"></div>
              <div className="skeleton"></div>
            </div>
          </Card>
        </div>
        <div className="col-lg-2 col-md-4 col-6 mb-2">
          <Card>
            <img src="/default-poster.png" alt="loading" />
            <div className="card-body pb-4">
              <div className="skeleton mb-3"></div>
              <div className="skeleton"></div>
            </div>
          </Card>
        </div>
        <div className="col-lg-2 col-md-4 col-6 mb-2">
          <Card>
            <img src="/default-poster.png" alt="loading" />
            <div className="card-body pb-4">
              <div className="skeleton mb-3"></div>
              <div className="skeleton"></div>
            </div>
          </Card>
        </div>
        <div className="col-lg-2 col-md-4 col-6 mb-2">
          <Card>
            <img src="/default-poster.png" alt="loading" />
            <div className="card-body pb-4">
              <div className="skeleton mb-3"></div>
              <div className="skeleton"></div>
            </div>
          </Card>
        </div>
        <div className="col-lg-2 col-md-4 col-6 mb-2">
          <Card>
            <img src="/default-poster.png" alt="loading" />
            <div className="card-body pb-4">
              <div className="skeleton mb-3"></div>
              <div className="skeleton"></div>
            </div>
          </Card>
        </div>
        <div className="col-lg-2 col-md-4 col-6 mb-2">
          <Card>
            <img src="/default-poster.png" alt="loading" />
            <div className="card-body pb-4">
              <div className="skeleton mb-3"></div>
              <div className="skeleton"></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
