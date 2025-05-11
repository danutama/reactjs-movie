import MediaSlideSection from '../common/MediaSlideSection';
import { fetchPopularMovies } from '../../service/api';

function PopularMovies() {
  return <MediaSlideSection title="Popular Movies" link="/movies/popular" fetchFunction={fetchPopularMovies} itemType="movie" />;
}

export default PopularMovies;
