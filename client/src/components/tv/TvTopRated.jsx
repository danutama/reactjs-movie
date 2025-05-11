import MediaSlideSection from '../common/MediaSlideSection';
import { fetchTopRatedTVShows } from '../../service/api';

function TvTopRated() {
  return <MediaSlideSection title="Top Rated TV Shows" link="/tv-shows/top-rated" fetchFunction={fetchTopRatedTVShows} itemType="tv" />;
}

export default TvTopRated;
