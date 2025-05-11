import MediaSlideSection from '../common/MediaSlideSection';
import { fetchTrendingMovies } from '../../service/api';

function TrendingMovies() {
  return <MediaSlideSection title="Trending Movies" link="/movies/trending" fetchFunction={fetchTrendingMovies} itemType="movie" />;
}

export default TrendingMovies;
