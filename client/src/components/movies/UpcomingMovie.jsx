import MediaSlideSection from '../common/MediaSlideSection';
import { fetchLatestMovies } from '../../service/api';

function UpcomingMovie() {
  return <MediaSlideSection title="Upcoming Movies" link="/movies/upcoming" fetchFunction={fetchLatestMovies} itemType="movie" />;
}

export default UpcomingMovie;
