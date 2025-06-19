import { lazy } from 'react';

// Home & Not Found
const Home = lazy(() => import('./Home'));
const NotFound = lazy(() => import('./404'));

// Movies
const Movies = {
  Index: lazy(() => import('./movies/Index')),
  Upcoming: lazy(() => import('./movies/Upcoming')),
  Trending: lazy(() => import('./movies/Trending')),
  Popular: lazy(() => import('./movies/Popular')),
  ByGenre: lazy(() => import('./movies/ByGenre')),
  Single: lazy(() => import('./movies/Single')),
};

// TV Shows
const TvShows = {
  Index: lazy(() => import('./tvshows/Index')),
  Trending: lazy(() => import('./tvshows/Trending')),
  Popular: lazy(() => import('./tvshows/Popular')),
  TopRated: lazy(() => import('./tvshows/TopRated')),
  AiringToday: lazy(() => import('./tvshows/AiringToday')),
  OnTheAir: lazy(() => import('./tvshows/OnTheAir')),
  ByGenre: lazy(() => import('./tvshows/ByGenre')),
  Single: lazy(() => import('./tvshows/Single')),
};

// People
const People = {
  Popular: lazy(() => import('./people/Popular')),
  Person: lazy(() => import('./people/Person')),
};

export default {
  Home,
  NotFound,
  Movies,
  TvShows,
  People,
};
